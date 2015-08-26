Web applications can use this library to connect to remote Styx servers right from the browser and talk Styx or 9P over HTTP(S). The corresponding web server (e.g. [ModLM](ModLM.md)) transmits Styx messages to the server and back handling the necessary encoding.

If you don't know what is a Styx client and server you can start with:
  * http://www.vitanuova.com/inferno/papers/styx.html
  * http://www.vitanuova.com/inferno/man/5/0intro.html

... imagine you have a remote FS mounted to your browser and a simple API to access it.

Browser support matrix:
| **Browser** | **Version** | **Supported** |
|:------------|:------------|:--------------|
| Firefox     | 2           | yes           |
| Safari      | 3           | yes           |
| Internet Explorer | 6           | not yet       |
| Internet Explorer | 7           | not yet       |
| Opera       | ?           | ?             |

We will port the library to other browsers in the future.

## High Level Interface ##

Consider the following code snippet in JavaScript (e.g. some HTML page):
```
var fs = new StyxFS("/styx", ehandler);
fs.mount("someone", "/net");

var dns = fs.open("/dns", Mode.ORDWR);

var msg = new Message([]);
msg.addString("code.google.com ip");

fs.write(dns, 0, msg.getBytes());
msg = new Message(fs.read(dns, 0, 16));

var ip = msg.getString(0);
```

There is also a working [example](http://limbo-machine.googlecode.com/svn/trunk/web/js/sample.html), which is able to connect to some Styx server and list the root directory contents. [ModLM](ModLM.md) page describes how to install and run the sample application.

## Implementation ##

The JavaScript module consists of the following components:

  * styx-fs.js -- high level interface to the Styx protocol
  * styx-protocol.js -- Styx protocol implementation
  * connection.js -- low level communication
  * message.js -- binary data message
  * types.js -- type definitions and constants

Connection uses [XMLHttpRequest](http://www.w3.org/TR/XMLHttpRequest) object to implement the actual data exchange.

TBD