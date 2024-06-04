

export default function orderInput({label,value}){
    
    return <div className="row my-1">
    <div className="col-3">{label}</div>
    <div className="col-9">
        <input readOnly className="form-control" defaultValue={value}/>
    </div>
</div>
}