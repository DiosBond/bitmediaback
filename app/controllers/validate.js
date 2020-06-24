/* function for control data on contains XSS */
function checkXSS(inp){
	return inp.replace(/<\/?[^>]+>/gi, '');	
};

/* function for validate as number */
function asNumber(inp){
    return  isFinite(inp) && inp === parseInt(inp, 10);
};

/* function for validate as date */
function asDate(inp){
    let strPars = inp.match(/\d+/g),
    date = new Date(strPars[2], strPars[1] - 1, strPars[0]);
    return date.getFullYear() == strPars[2] &&
             date.getDate() == strPars[0] &&
             date.getMonth() == strPars[1] - 1;
    }
    

module.exports.checkXSS = checkXSS;
module.exports.asNumber = asNumber;
module.exports.asDate = asDate;

