function get(string) {
    return localStorage.getItem(string)
}

function save(string, value) {
    localStorage.setItem(string, value)
}
