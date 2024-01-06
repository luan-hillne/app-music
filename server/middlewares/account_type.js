const accountType = (account) => {
    const gmail = /^\S+@\S+\.\S+$/
    const phone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
    if (gmail.test(account)) return 'gmail'
    else if (phone.test(account)) return 'phone'
    return 'undefind'
}

module.exports = {
    accountType
}