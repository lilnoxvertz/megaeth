const fs = require("fs")

class Proxy {
    static async load() {
        const proxy = fs.readFileSync("proxy.txt", "utf-8")
            .split("\n")
            .filter(line => line.trim())
            .map(line => {
                const [address, port, user, password] = line.split(":").map(part => part.trim())
                return {
                    address: address,
                    port: port,
                    username: user,
                    password: password
                }
            })
        return proxy
    }
}

module.exports = Proxy