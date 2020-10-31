"use strict"

const uniqueMessage = error => {
    let output;
    try { 
        let fieldName = error.messsage.split(".$")[1]
        field = field.split("dub key")[0]
        field = field.substring(0, field.lastIndexOf("_"))
        req.flash("errors", [{
            message:"An Account with this " + field + "already exist"
        }])
        output =fieldName.charAt(0).toUpperCase() + fieldname.slice(1) +"already exist"
    } catch (err) {
        output ="already exist"

    }
    return output
}
exports.errorhandler = error=> {
    let message = ""
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error)
                break;
            default:
                message ="Somthing is wrong"
                
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message) {
                message = error.errorors[errorName].message
            }
        }
    }
    return message
}