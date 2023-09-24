function getData() {
    fetch('/content/receipts.json',{
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }})
      .then(results => results.json())
      .then(info => {
        return info;
      })
};
function convertStrToNum(str){
    return Number(str.replace(/[^0-9.-]+/g,""));
}
function converNumToString(num){
    return num.toLocaleString('en-US', {
        style:'currency',
        currency:'USD'
    })
}
function getProductDets(receipts, prodName){
    // let receiptData = getData();
    var productSoldTot = 0;
    var prodCost = 0;
    let resp = {
        prodTotSold:0,
        totalGross:0
    }
    if(receipts){
        receipts.forEach(receipt => {
            receipt.Items.forEach(item => {
                if(item.Item === prodName){
                    if(prodCost == 0){
                        prodCost = convertStrToNum(item.ItemPrice);
                    }
                    productSoldTot += Number(item.Quantity);
                }
            });
        });
    }
    resp.prodTotSold = productSoldTot;
    let grossDouble = productSoldTot * prodCost;
    resp.totalGross = converNumToString(grossDouble);
    console.log("resp:", resp);
    return resp;
}

function createProdDataset(receipts){
    let productsResp = [];

    if(receipts){
        receipts.forEach(receipt => {
            receipt.Items.forEach(item => {
                var prodIndex = productsResp.map(function(x) {return x.Item; }).indexOf(item.Item);
                if(prodIndex == -1){//doesn't exist in our dataset yet? add it with new fields on top.
                    item.AmountSold = Number(item.Quantity); //first time being added into our dataset, we need to add the initial value since it could be more than one on the receipt.
                    item.ProdGross = Number(item.Quantity) * convertStrToNum(item.ItemPrice);
                    item.SoldHistory = [];
                    item.SoldHistory.push({DateSold: new Date(receipt.Date), QuantitySoldPerDate: item.Quantity});
                    item.TimesSold = 1;
                    //console.log('new item found in our receipt!: ', item);
                    productsResp.push(item);
                }
                else{
                    //if already in our dataset, then just update the quantity and gross
                    productsResp[prodIndex].AmountSold += Number(item.Quantity);
                    productsResp[prodIndex].ProdGross += Number(item.Quantity) * convertStrToNum(item.ItemPrice);
                    productsResp[prodIndex].SoldHistory?.push({DateSold: new Date(receipt.Date), QuantitySoldPerDate: item.Quantity});
                    productsResp[prodIndex].TimesSold+=1;
                    //console.log('product already exists in dataset');
                }
            });
        });
    }
    productsResp.forEach(item =>{
        item.ProdGross = converNumToString(item.ProdGross);
    })
    console.log('resp',productsResp)
    return productsResp;
}
function getCustHist(id, receipts){  
    let custHistResp = [];
    if(receipts){
        receipts.forEach(receipt=>{
            if(receipt.CustomerId == id){
                custHistResp.push(receipt);
            }
        })
    }
    return custHistResp;
}
function getCustData(receipts){
    let customerResp = [];

    if(receipts){
        receipts.forEach(receipt =>{
            var custIndex = customerResp.map(function(x) {return x.CustomerId; }).indexOf(receipt.CustomerId);
            if(custIndex == -1){
                var customerObj = {}
                customerObj.Name = receipt.CustomerName;
                customerObj.CustomerId = receipt.CustomerId;
                customerObj.totalSpent = convertStrToNum(receipt.Total);
                customerObj.visitCount = 1; 
                customerObj.visitHist = [];
                customerResp.push(customerObj);
            }
            else{
                customerResp[custIndex].totalSpent += convertStrToNum(receipt.Total);
                customerResp[custIndex].visitCount += 1;

            }
        })
    }
    customerResp.forEach(receipt =>{
        receipt.totalSpent = converNumToString(receipt.totalSpent);
    })
    return customerResp;
}
export { getData, getProductDets, createProdDataset, getCustData, getCustHist};