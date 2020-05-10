export const colorOnConfirmed=(cases)=>{
    let color = "#FCA78F"
    if(cases>1)
        color="#F88665"
    if(cases>5)
        color = "#F77A56"
    if (cases > 30)
        color = "#F96E46"
    if (cases > 100)
        color = "#FD6336"
    if (cases > 200)
        color = "#F95D30"
    if (cases > 500)
        color = "#FA5121"
    if (cases > 800)
        color = "#FB4A18"
    if (cases > 1000)
        color = "#FC4714"
    if (cases > 2000)
        color = "#FA3903"
    return color;

}


