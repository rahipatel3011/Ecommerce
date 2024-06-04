export default function OrderProductDetail({product}){
    const {productName,price,quantity} = product;
    return <li className="list-group-item d-flex justify-content-between p-2">
    <div className="row container">
        <div className="col-8">

            <h6 className="my-0 text-primary">{productName}</h6>
            <small className="text-muted">Price : {price}</small><br />
            <small className="text-muted">Quantity : {quantity}</small>
        </div>
        <div className="col-4 text-end">
            <p className="text-success">{quantity  * price}</p>
        </div>
    </div>
</li>
}