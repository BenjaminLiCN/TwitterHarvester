
sudo apt-get install -y apt-transport-https gnupg ca-certificates
echo "deb https://apache.bintray.com/couchdb-deb bionic main"     | sudo tee -a /etc/apt/sources.list.d/couchdb.list
sudo apt-key adv --keyserver-options http-proxy=http://wwwproxy.unimelb.edu.au:8000/ --keyserver keyserver.ubuntu.com --recv-keys   8756C4F765C9AC3CB6B85D62379CE192D401AB61
sudo apt update
sudo apt install -y couchdb
sudo apt-get --no-install-recommends -y install \
    build-essential pkg-config erlang \
    libicu-dev libmozjs185-dev libcurl4-openssl-dev
sudo systemctl start couchdb
sudo systemctl enable couchdb
