let intervalTimer;

function login() {

    let nama = document.getElementById("nama").value.trim();
    let nim = document.getElementById("nim").value.trim();

    if (nama === "" || nim === "") {
        alert("Nama dan NIM wajib diisi!");
        return;
    }

    localStorage.setItem("nama", nama);
    localStorage.setItem("nim", nim);

    window.location.href = "scan.html";
}

function startScanner() {

    function onScanSuccess(decodedText) {

        let dataQR;

        try {

            dataQR = JSON.parse(decodedText);

        } catch {

            alert("Format QR Salah!");
            return;
        }

        if (Date.now() > dataQR.expired) {

            alert("QR Sudah Expired!");
            return;
        }

        let pertemuan = dataQR.pertemuan;

        let nama = localStorage.getItem("nama");
        let nim = localStorage.getItem("nim");

        let waktu = new Date().toLocaleString();

        document.getElementById("hasil").innerHTML =
        `
        Nama : ${nama}<br>
        NIM : ${nim}<br>
        Pertemuan : ${pertemuan}<br>
        Jam : ${waktu}
        `;

        fetch("https://script.google.com/macros/s/AKfycbwSkIuTTawiyiiMjgWLV-TSCOBn9TAa6Ns1CRWo3xiN6eMxsY4js7kGYjBuP-CTY9AZ/exec", {

            method: "POST",

            body: JSON.stringify({

                nama: nama,
                nim: nim,
                pertemuan: pertemuan,
                waktu: waktu

            })

        })
        .then(res => res.text())
        .then(data => {
            console.log(data);
            alert("Absensi Berhasil!");
        })
        .catch(err => {
            console.error(err);
            alert("Gagal mengirim data!");
        });
    }

    const scanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: 250
        }
    );

    scanner.render(onScanSuccess);
}

function loginAdmin(){

    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    if(user === "OctavaCenturia104" && pass === "Viky270905"){

        localStorage.setItem("admin", "true");

        window.location.href = "admin.html";

    }else{

        alert("Username atau Password Salah");

    }
}

function buatQR(){

    let pertemuan =
    document.getElementById("pertemuan").value.trim();

    if(pertemuan === ""){

        alert("Isi nama pertemuan terlebih dahulu!");
        return;
    }

    let expired =
    Date.now() + (15 * 60 * 1000);

    let dataQR = {

        pertemuan : pertemuan,
        expired : expired

    };

    let isiQR =
    JSON.stringify(dataQR);

    localStorage.setItem(
        "qrAktif",
        isiQR
    );

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(
        document.getElementById("qrcode"),
        isiQR
    );

    clearInterval(intervalTimer);

    intervalTimer = setInterval(() => {

        let sisa =
        Math.floor((expired - Date.now()) / 1000);

        if(sisa <= 0){

            clearInterval(intervalTimer);

            document.getElementById("timer").innerHTML =
            "QR Expired";

            localStorage.removeItem("qrAktif");

            document.getElementById("qrcode").innerHTML = "";

            return;
        }

        let menit =
        Math.floor(sisa / 60);

        let detik =
        sisa % 60;

        document.getElementById("timer").innerHTML =
        `Expired dalam ${menit}:${detik.toString().padStart(2,'0')}`;

    }, 1000);

}

function logoutAdmin(){

    localStorage.removeItem("admin");

    window.location.href = "admin-login.html";
}
