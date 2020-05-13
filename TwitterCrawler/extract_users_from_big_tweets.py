from mpi4py import MPI
import json
import sys,time,os
import numpy as np
import math

# check if the user in the three cities
def is_in_grid(coordinate, grids):
    for grid in grids:
        if grid[0] <= coordinate[0] <= grid[2] and grid[1] <= coordinate[1] <= grid[3]:
                return True
    return False

def merge_user(all_users):
    final_users = set()
    for users in all_users:
        final_users.update(users)
    return final_users

if __name__ == "__main__":
    time1=MPI.Wtime()
    fileName=sys.argv[1]
    bufferSize = int(sys.argv[2])

    # Initializations and preliminaries
    comm = MPI.COMM_WORLD  # get MPI communicator object
    size = comm.Get_size()  # total number of processes
    rank = comm.Get_rank()  # rank of this process
    status = MPI.Status()  # get MPI status object

    grids = [[149.9719,-34.3312,151.6305,-32.9961],[144.3336,-38.5030,145.8784,-37.1751],[115.4495,-32.8019,116.4151,-31.4551]]

    tweetFile = MPI.File.Open(comm,fileName,MPI.MODE_RDONLY)
    fileSize = tweetFile.Get_size()

    loopSize = int(math.ceil(fileSize/size/bufferSize/8))
    users = set()

    for i in range(loopSize):
        #set buffer and offset
        buffer = np.empty(bufferSize,dtype=np.int)
        offset = buffer.nbytes*(i*size+rank)
        bufferEnd = offset + buffer.nbytes - 1
        if offset>=fileSize:
            break

        #read one buffer
        tweetFile.Read_at(offset,buffer)

        tweets = bytes(buffer)
        if offset<fileSize<=bufferEnd:
            tweets =tweets[:fileSize-offset-1]

        tweetList = tweets.decode("UTF-8",'replace').split('\n')

        #send the first fragment to the previous processor
        if size!=1 and not(rank==0 and i==0) and offset<=fileSize:
            firstMsg = tweetList[0]
            comm.isend(firstMsg,dest=(rank-1)%size,tag=i)
            del tweetList[0]

        if rank!=size-1 and bufferEnd<=fileSize:
            req = comm.irecv(source=rank+1,tag=i)

        #receive the fragement from the next processor to concat with the last fragment
        if size!=1 and rank == size-1 and i !=loopSize-1 and bufferEnd<=fileSize:
            req = comm.irecv(source=(rank+1)%size,tag=i+1)

        #Process data
        for line in tweetList:
            try:
                # wait until the last fragment is received to process the last json object
                if line==tweetList[-1]:
                    line += req.wait()
                r = json.loads(line.strip('\n').strip().strip(',').lower())
                if 'coordinates' in r['doc']['coordinates']:
                    if is_in_grid(r['doc']['coordinates']['coordinates'], grids):
                        users.add(r['doc']['user']['screen_name'])
            except Exception as e:
                continue
    comm.Barrier()
    all_users = comm.gather(users, root=0)
    tweetFile.Close()

    if rank == 0:
        final_users = merge_user(all_users)
        print(len(final_users))
        with open("users_from_big_tweets.txt", 'w+', encoding='utf-8') as f:
            for user in final_users:
                f.write(user+'\n')


        print(rank,MPI.Wtime()-time1)
