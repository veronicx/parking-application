
function generateID() {
    var id = "random-";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return id;
}
