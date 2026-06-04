const ProductAccessBox = ({ purchase }) => {
  return (
    <div className="card">
      <h3>{purchase.product.title}</h3>
      <p>{purchase.product.description}</p>

      <div className="actions">
        {purchase.accessUrl && (
          <a className="btn btn-primary" href={purchase.accessUrl} target="_blank">
            Open Link
          </a>
        )}

        {purchase.fileUrl && (
          <a className="btn btn-outline" href={purchase.fileUrl} target="_blank">
            Download File
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductAccessBox;