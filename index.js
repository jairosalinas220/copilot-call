var currier = "blueexpress";
const products = [
    "5 duston gel + 4 duston gel gift 184950",
    "4 duston gel + 3 duston gel gift 147960",
    "3 duston gel + 2 duston gel gift 110970",
    "2 duston gel + 1 duston gel gift 73980",
    "1 duston gel 37990 + delivery 6000",
    "5 incasol + 4 incasol gift 184950",
    "4 incasol + 3 incasol gift 147960",
    "3 incasol + 2 incasol gift 110970",
    "2 incasol + 1 incasol gift 73980",
    "1 incasol 37990 + delivery 6000",
    "5 oxys + 4 oxys gift 184950",
    "4 oxys + 3 oxys gift 147960",
    "3 oxys + 2 oxys gift 110970",
    "2 oxys + 1 oxys gift 73980",
    "1 oxys 37990 + delivery 6000"
];
const abreviaturas = {
    "DEPARTAMENTO": "DTO",
    "INTERIOR": "INT",
    "PISO": "PS",
    "BLOQUE": "BQ",
    "OFICINA": "OFC",
    "TORRE": "TRR",
    "CASA": "CS",
    "CONDOMINIO": "COND"
};
document.getElementById("delete").addEventListener("click", () => {
    document.querySelectorAll(".input-box").forEach(input => {
        input.value = "";
    })
});
function obtenerValor(nombre) {
    let valor = "";
    document.querySelectorAll(`[name="${nombre}"]`).forEach(input => {
        if (input.closest(`#${currier}`)) {
            valor = input.value.trim();
        }
    });
    return valor;
}
document.querySelectorAll(".product-input-container input").forEach(input => {
    input.addEventListener('input', (event) => {
        const container = event.target.parentElement;
        const list = container.querySelector(".list-products");
        const filtro = event.target.value.toLowerCase();
        const productosFiltrados = products.filter(producto =>
            producto.toLowerCase().includes(filtro)
        );
        showProducts(productosFiltrados, list, event.target);
    });

    input.addEventListener("focus", (event) => {
        const container = event.target.parentElement;
        container.querySelector(".list-products").classList.remove("hidden");
    });
});
function showProducts(productosFinals, list, input) {
    list.innerHTML = '<ul class="p-0 m-0 list-none outline-none">';
    productosFinals.forEach(producto => {
        list.innerHTML += `<li class="p-1 cursor-pointer hover:bg-gray-600">${producto}</li>`;
    });
    list.innerHTML += '</ul>';

    list.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            input.value = item.textContent;
            list.classList.add('hidden');
        });
    });
}
document.addEventListener('click', (event) => {
    document.querySelectorAll(".list-products").forEach(list => {
        const input = list.parentElement.querySelector("input");
        if (!list.classList.contains('hidden') &&
            event.target !== input &&
            !list.contains(event.target)) {
            list.classList.add('hidden');
        }
    });
});
function distribuirTexto(event) {
    event.preventDefault();
    const textPaste = (event.clipboardData || window.clipboardData).getData('text');
    let textDiv = textPaste.split("\t");
    let inputs = document.querySelectorAll(".input-box");
    for (let i = 0; i < inputs.length; i++) {
        if (textDiv[i]) {
            inputs[i].value = textDiv[i];
        }
    }
}
function reemplazarAbreviaturas(texto) {
    let textoModificado = texto;
    for (const palabra in abreviaturas) {
        const abreviatura = abreviaturas[palabra];
        const regex = new RegExp(palabra, "gi");
        textoModificado = textoModificado.replace(regex, abreviatura);
    }
    return textoModificado;
}
document.querySelector(".central").addEventListener("paste", distribuirTexto);
document.querySelectorAll(".input-box").forEach(input => {
    input.addEventListener("input", () => {
        const region = document.getElementsByName("region")[0].value.trim();
        const commune = document.getElementsByName("commune")[0].value.trim();
        const locality = document.getElementsByName("locality")[0].value.trim();
        const address = document.getElementsByName("address")[0].value.trim();
        const address_number = document.getElementsByName("address_number")[0].value.trim();
        const streets = obtenerValor("streets");
        const reference = obtenerValor("reference");
        const house_description = obtenerValor("house_description");
        const house_description_side = obtenerValor("house_description_side");
        const house_side = obtenerValor("house_side");
        const additionalNumber = obtenerValor("number") ? `${obtenerValor("number")} WH` : "WH";
        const product = obtenerValor("input_products");
        const dateString = obtenerValor("date");
        let formattedDate = "";
        let finalComment;
        if (currier === "blueexpress") {
            finalComment = `${locality} / ${address} ${address_number}  / ${reference}, ${house_description} / ${house_side} ${house_description_side}/ ${additionalNumber} / ${product}`;
        } else {
            const date = new Date(dateString  + "T00:00:00");
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${day}-${month}-${year}`;
            finalComment = `${region} / ${commune} / ${locality} / ${address} ${address_number} ${streets} / ${additionalNumber} /${reference}, ${house_description} / ${dateString} / ${additionalNumber} / ${product}`;
        }
        finalComment = reemplazarAbreviaturas(finalComment).toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        document.querySelectorAll("[name=final_comment]").forEach(
            input => input.value = finalComment
        )
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateElement", value: finalComment });
        });
    });
})
const tablinks = document.querySelectorAll(".tablink");
const tabcontent = document.querySelectorAll(".tabcontent");
tablinks.forEach((tablink, i) => {
    tablink.addEventListener("click", () => {
        target = tablink
        tablinks.forEach((tab, j) => {
            tab.classList.remove("bg-zinc-700");
            tabcontent[j].classList.add('hidden');
        });;
        i === 0 ? currier = "blueexpress" : currier = "contraentrega";
        console.log(currier)
        tabcontent[i].classList.remove('hidden');
        target.classList.add("bg-zinc-700");
    });
});
document.getElementsByName("update_date").forEach((text) => {
    text.textContent = `${text.textContent} ${new Date().getDate().toString().padStart(2, '0')}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}`;
})
