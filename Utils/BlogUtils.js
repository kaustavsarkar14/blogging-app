const blogDataValidate = ({title, textBody})=>{
    return new Promise((resolve, reject)=>{
        if(!title || !textBody) reject("missing data")
        if(typeof title!== "string" || typeof textBody!=="string") reject("invalid data type")
        if(title.length<3) reject("title length should be atleast 3")
        resolve()
    })
}

module.exports = {blogDataValidate}