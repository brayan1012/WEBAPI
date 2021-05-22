window.onload = function () {
    var xz= document.getElementById("download");
        if(xz){
            xz.addEventListener("click", () => {
                const invoice = this.document.getElementById("invoice");
                console.log(invoice);
                console.log(window);
                var opt = {
                    margin: 1,
                    filename: 'Usuarios.pdf',
                    image: { type: 'jpeg', quality: 0.90 },
                    html2canvas: { scale: 3 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().from(invoice).set(opt).save();
            })
        }
}
