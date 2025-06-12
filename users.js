// Kullanıcıları saklamak için bir dizi
const users = [];

// Yeni kullanıcı ekleme fonksiyonu
function addUser(username, email) {
    users.push({ username, email });
}

// 3 farklı kullanıcı ekleyelim
addUser('ali', 'ali@example.com');
addUser('ayse', 'ayse@example.com');
addUser('mehmet', 'mehmet@example.com');

// Kullanıcıları görüntüle
console.log(users);
