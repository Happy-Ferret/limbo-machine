// var tAttach = new Message(...);
// Connection c = new Connection('/myService');
// var rAttach = c.tx(tAttach);

Connection = function(service, onerror) {
    this.service = service;
    this.onerror = onerror;
    this.req = new XMLHttpRequest();
}

Connection.prototype.tx = function(imsg) {
    this.req.open("POST", this.service, false);
    this.req.overrideMimeType("text/plain; charset=x-user-defined");
    this.req.send(marshall(imsg.getBytes()));

    if (this.req.status > 299 || this.req.status < 200)
        return new Message([]);

    var omsg = new Message(unmarshall(this.req.responseText));
    if (omsg.get32(0) != omsg.length())
        this.onerror("message lengths do not match");

    return omsg;
}

function marshall(data) {
    var res = [];
    for (var i = 0, len = data.length; i < len; i++) {
        var octet = data[i] & 0xFF;
        res.push(enc(octet >> 4));
        res.push(enc(octet & 0x0F));
    }

    return res.join("");
}

function enc(ch) {
    return (ch < 10) ?
        String.fromCharCode(48 + ch) : String.fromCharCode(87 + ch);
}

function unmarshall(data) {
    var res = [];
    for (var i = 0, len = (data.length - 1); i < len; i += 2)
        res.push(16 * dec(data.charCodeAt(i)) + dec(data.charCodeAt(i + 1)));

    return res;
}

function dec(ch) {
    ch = ch & 0xFF;
    return (ch < 97) ? (ch - 48) : (ch - 87);
}
