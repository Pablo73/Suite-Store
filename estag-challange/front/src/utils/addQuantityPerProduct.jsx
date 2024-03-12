
function addQuantityPerProduct(getProductNamePurchase, numberValueAvailableQuantity) {

    const getAllPurchaset = JSON.parse(localStorage.getItem('purchase')) || [];

    
    const resultado = [];
    const somas = {};
    
    getAllPurchaset.forEach((item) => {
        const { nameProduct, amount} = item;


        
        if (!somas[nameProduct]) {
            somas[nameProduct] = {
                nameProduct,
                amount: 0,
            };
            resultado.push(somas[nameProduct]);
        }
        somas[nameProduct].amount += amount;
    });
    
    const isStockSufficient = resultado.every((value) => {
        if (value.nameProduct === getProductNamePurchase && value.amount > numberValueAvailableQuantity) {
            handleInsufficientStock(value.nameProduct,  numberValueAvailableQuantity);
            return false;
        }
        return true;
    });

    if (!isStockSufficient) {
        const purchase = JSON.parse(localStorage.getItem('purchase')) || [];
        const newArray = purchase.slice(0, -1);
        localStorage.setItem('purchase', JSON.stringify(newArray));
    }

    function handleInsufficientStock(productName, stockQuantity) {
        alert(`We have ${stockQuantity} ${productName} in stock. Change the quantity to complete the purchase.`);
    }

}

export default addQuantityPerProduct;