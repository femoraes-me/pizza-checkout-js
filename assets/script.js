const sel = (elemento) => document.querySelector(elemento);
const selAll = (elemento) => document.querySelectorAll(elemento);

let cart = [];
let modalQt = 1;
let modalKey = 0;

pizzaJson.map((item, index) => {    
    let pizzaItem = sel('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index); //definindo index para as pizzas

    //montagem do grid com pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //listagem das pizzas
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        
        e.preventDefault(); // bloqueando ação padrão da tag

        modalQt = 1 // setando o valor 1 novamente ao abrir

        //pegando index da pizza clicada
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key; // Gravando na variável qual o index da pizza selecionada

        //preenchendo modal com as informações da pizza
        sel('.pizzaBig img').src = pizzaJson[key].img;
        sel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        sel('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        sel('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        sel('.pizzaInfo--size.selected').classList.remove('selected'); 
        
        selAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 1) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //colocando a quantidade de pizzas
        sel('.pizzaInfo--qt').innerHTML = modalQt;
      
        // colocando efeito para a abertura do modal
        sel('.pizzaWindowArea').style.opacity = 0;
        sel('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => { sel('.pizzaWindowArea').style.opacity = 1; });        
    });

    sel('.pizza-area').append(pizzaItem);
});


// EVENTOS DO MODAL //
//fechando modal
function closeModal(){
    sel('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {
        sel('.pizzaWindowArea').style.display = 'none';    
    }, 500);
};

selAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//alterando as quantidades
sel('.pizzaInfo--qtmenos').addEventListener('click', () => {
    //verificando se quantidade de pizzas é maior que 1 para fazer redução
    if(modalQt > 1) {
        modalQt--; 
        sel('.pizzaInfo--qt').innerHTML = modalQt; //colocando a quantidade de pizzas      
    }
    
});
sel('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    sel('.pizzaInfo--qt').innerHTML = modalQt; //colocando a quantidade de pizzas      
});

//selecionando espessura da massa
selAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        sel('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//adicionando ao carrinho de compras
sel('.pizzaInfo--addButton').addEventListener('click',  () => {
    let size = parseInt(sel('.pizzaInfo--size.selected').getAttribute('data-key'));

    //criando identificador de sabor e tamanho
    let identfier = pizzaJson[ modalKey ].id + '@' + size;

    //verificando se ja existe pizza com mesmo identificador no array
    let key = cart.findIndex((item) => item.identfier == identfier);
    if (key > -1) { //-1 significa retorno vazio
        //aumentando a quantidade do item encontrado
        cart[key].qt += modalQt;
    } else {
        //adicionando novo item
        cart.push({
            identfier,
            id : pizzaJson[ modalKey ].id,
            size,
            qt : modalQt
        });
    }    

    closeModal();
    updateCart();
    
});

// AÇÕES NO MENU MOBILE //
sel('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        sel('aside').style.left = '0';
    }
});
sel('.menu-closer').addEventListener('click', () => {
    sel('aside').style.left = '100vw';
});


// AÇÕES DO CARRINHO DE COMPRAS //
//funcão de atualização
function updateCart(){
    sel('.menu-openner span').innerHTML = cart.length; //contador de itens no menu mobile

    if (cart.length > 0) {
        sel('aside').classList.add('show'); //adiciona class que exibe o carrinho

        sel('.cart').innerHTML = ''; //limpa a sessão do carrinho para evitar replicações

        //variaveis de compra
        let subtotal = 0;
        let taxa = 0;
        let total = 0;

        //buscando informações da pizza
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id); //encontrando pizza no Json e coletando informações

            subtotal += pizzaItem.price * cart[i].qt; //calculando o subtotal
            
            let cartItem = sel('.models .cart--item').cloneNode(true); //clonando elementos do HTML
            
            //concatenando os nomes com as tipos de massas
            let pizzaSizeName;
            switch ( cart[i].size ) {
                case 0 :
                    pizzaSizeName = 'F'; break;
                case 1 :
                    pizzaSizeName = 'M'; break;
                case 2 :
                    pizzaSizeName = 'G'; break;
            }
            let pizzaName = `${ pizzaItem.name } (${ pizzaSizeName })`;
            
            //preenchendo informações
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            //colocando ações para alterar as quantidades no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if ( cart[i].qt > 1 ) {
                    cart[i].qt--; //diminui a quantidade no carrinho
                } else {
                    cart.splice(i,1); //remove se menor do que 1
                }    
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++; //aumentando quantidades
                updateCart(); //atualizando o carrinho
            });

            sel('.cart').append(cartItem);
        }

        taxa = subtotal * 0.1; //pegando os 10%
        total = subtotal + taxa; //calculando o total

        //exibindo valores no carrinho
        sel('.subtotal span:last-child').innerHTML = `R$ ${ subtotal.toFixed(2) }`;
        sel('.taxa span:last-child').innerHTML = `R$ ${ taxa.toFixed(2) }`;
        sel('.total span:last-child').innerHTML = `R$ ${ total.toFixed(2) }`;

    } else {
        sel('aside').classList.remove('show'); //fechando carrinho de compras da tela
        sel('aside').style.left = '100vw'; //fechando carrinho de compras tela mobile
    }
}