export function monthFromStr(date){
    var month= Number(date.slice(0,1))
    if(date.charAt(0)==='0')
        month= Number(date.charAt(1))
    return month
}

export function dayFromStr(date) {
    var day= parseInt(date.slice(2,3))
    if(date.charAt(2)==='0')
        day= Number(date.charAt(3))
    return day
}

export function dayFromValue(value){
    var day=0
    if(value<31)
        day=value+1
    else if(value<60)
        day=value-30
    else if(value<91)
        day=value-59
    else if(value<121)
        day=value-90
    return day
}

export function strFromDate(month,day){
    var monthstr=month.toString()
    if(monthstr.length<2)
        monthstr='0'+monthstr
    var daystr=day.toString()
    if(daystr.length<2)
        daystr='0'+daystr
    return monthstr+daystr
}




