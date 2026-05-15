import { useState, useEffect } from "react";
import { useFormik } from "formik";//library for form handling and validation
import Toast from "../components/Toast";//lel notifications 
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

//dih function validation le formik
function validate(values) {
  const errors = {};

  //lw el esm fady keda y3ny
  if (!values.name.trim()) {
    errors.name = "Product name is required";
  }

  if (!values.price) {
    errors.price = "Price is required";
  } else if (Number(values.price) < 0) {
    errors.price = "Price must be a positive number";
  }

  if (values.stock !== "" && Number(values.stock) < 0) {
    errors.stock = "Stock must be a positive number";
  }

  return errors;
}

function AdminProducts() {
  const { token } = useAuth();//token bta3 el user el 3amel login 3shan nst5dmoh f authorization header lma n3ml requests lel backend
  //dol el states b2a
  const [products, setProducts]      = useState([]);
  const [categories, setCategories]  = useState([]);
  const [loading, setLoading]        = useState(true);
  const [dialogOpen, setDialogOpen]  = useState(false);
  const [editingProduct, setEditing] = useState(null);
  const [deleteId, setDeleteId]      = useState(null);
  const [toast, setToast]            = useState(null);
  const [imagePreview, setPreview]   = useState(""); // local image preview

  // awl ma el page tfth y3ml load lel categories wel products mn el backend 3shan y3rdhom f el UI
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);//we [] 3shan y3mlha run marra wa7da bas 
//ygeeb el products mn el backend w y7otha f state 3shan n3rdha f el UI
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setToast({ message: "Could not load products", type: "error" });
    }
    setLoading(false);
  };
  const fetchCategories = async () => {
    try {
      const res  = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setToast({ message: "Could not load categories", type: "error" });
    }
  };
//3lshan n3ml new product be formik
  const openCreate = () => {
    setEditing(null);//y3ny m3ndnsh product 3ndna 2bl kda b3ml create gded msh edit y3ny 3lshan afr2
    setPreview("");
    formik.resetForm();//3lshan lw mlyana mn abl keda 
    setDialogOpen(true);//nfth el form
  };
  const openEdit = (product) => {
    setEditing(product);
    setPreview(product.image || ""); // show existing image in preview
    formik.setValues({
      name:        product.name        || "",
      description: product.description || "",
      price:       product.price       || "",
      stock:       product.stock       ?? "",
      material:    product.material    || "",
      category:    product.category?._id || product.category || "",
      image:       product.image       || "",
    });
    setDialogOpen(true);
  };

 //da leh 3alak bel image upload bn3mlha compress el awl abl ma nhwlha le base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result; 
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 800;
        let width  = img.width;
        let height = img.height;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width  = MAX_SIZE;
          } else {
            width  = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        formik.setFieldValue("image", compressed); 
        setPreview(compressed);                   
      };
    };
    reader.readAsDataURL(file); 
  };

  const formik = useFormik({
    initialValues: {
      name:        "",
      description: "",
      price:       "",
      stock:       "",
      material:    "",
      category:    "",
      image:       "", 
    },
    validate,
    // lma bnslm el fotm b3ml request lel backend lw 3ndna editingProduct y3ny update lw la y3ny create
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      try {
        // lw editingProduct موجود يبقى update product, lw la yb2a create product
        let url;
        let method;

        if (editingProduct) {
          url    = `${API_URL}/products/${editingProduct._id}`;
          method = "PUT";
        } else {
          url    = `${API_URL}/products`;
          method = "POST";
        }

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
            stock: Number(values.stock) || 0,
            //3lshan type error
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setStatus(data.message || "Something went wrong");
          return;
        }

        setToast({ message: editingProduct ? "Product updated!" : "Product created!", type: "success" });
        setDialogOpen(false);
        fetchProducts(); // refresh al product list
      } catch (err) {
        setStatus("Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) 
        throw new Error("Failed to delete product");
      setToast({ message: "Product deleted", type: "success" });
      fetchProducts();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
    setDeleteId(null);
  };
  

  //-----------------------------------------------------------------------------------------------------------
  //UI 
  return (
    <div className="container py-4">

      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="serif mb-0">Products</h4>
          <small className="text-muted">{products.length} total</small>
        </div>
        <button className="btn btn-dark" onClick={openCreate}>
          <i className="bi bi-plus me-1"></i> Add Product
        </button>
      </div>

      {/* ── Product Cards ── */}
      {loading ? (
        <div className="row g-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col-12 col-sm-6 col-md-4">
              <div className="card placeholder-glow" style={{ height: 200 }}>
                <div className="placeholder w-100 h-100"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3">
          {products.map((p) => (
            <div className="col-12 col-sm-6 col-md-4" key={p._id}>
              <div className="card h-100">

                {/* Product image */}
                <div style={{ position: "relative", width: "100%", paddingBottom: "133%" }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "#f0ece6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bi bi-image fs-1 text-muted"></i>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title mb-1">{p.name}</h6>
                  <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>{p.price} EGP</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className={`badge ${p.stock > 0 ? "bg-secondary" : "bg-dark"}`}>
                      Stock: {p.stock}
                    </span>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(p._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">No products yet.</div>
          )}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {dialogOpen && (
        <div
          className="modal show d-flex"
          style={{ background: "rgba(0,0,0,0.5)", position: "fixed", inset: 0, zIndex: 300, alignItems: "center", justifyContent: "center" }}
        >
          <div className="modal-dialog modal-dialog-scrollable w-100" style={{ maxWidth: 520 }}>
            <div className="modal-content">

              {/* Modal header */}
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
                <button type="button" className="btn-close" onClick={() => setDialogOpen(false)}></button>
              </div>

              {/* Modal body = the form */}
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit} noValidate>

                  {/* Server-side error message */}
                  {formik.status && (
                    <div className="alert alert-danger py-2" style={{ fontSize: "0.83rem" }}>
                      {formik.status}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      name="name"
                      className={`form-control ${formik.touched.name && formik.errors.name ? "is-invalid" : ""}`}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {/* Show error only after user touches the field */}
                    {formik.touched.name && formik.errors.name && (
                      <div className="invalid-feedback">{formik.errors.name}</div>
                    )}
                  </div>

                  {/* Description field */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={3}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                  </div>

                  {/* Price and Stock side by side using Bootstrap grid */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        name="price"
                        className={`form-control ${formik.touched.price && formik.errors.price ? "is-invalid" : ""}`}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.price && formik.errors.price && (
                        <div className="invalid-feedback">{formik.errors.price}</div>
                      )}
                    </div>
                    <div className="col-6">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        className={`form-control ${formik.touched.stock && formik.errors.stock ? "is-invalid" : ""}`}
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.stock && formik.errors.stock && (
                        <div className="invalid-feedback">{formik.errors.stock}</div>
                      )}
                    </div>
                  </div>

                  {/* Image upload field */}
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>

                    {/* Preview: shows existing image (edit mode) or newly selected image */}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="d-block mb-2 rounded"
                        style={{ width: "100%", height: 160, objectFit: "cover" }}
                      />
                    )}

                    {/* File picker — user selects an image from their device */}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                    <div className="form-text">Upload a JPG, PNG, or WEBP image.</div>
                  </div>

                  {/* Material field */}
                  <div className="mb-3">
                    <label className="form-label">Material</label>
                    <input
                      name="material"
                      className="form-control"
                      value={formik.values.material}
                      onChange={formik.handleChange}
                    />
                  </div>

                  {/* Category dropdown */}
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                    >
                      <option value="">None</option>
                      {/* Map over categories array to create an option for each one */}
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Form action buttons */}
                  <div className="modal-footer px-0 pb-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={formik.isSubmitting}
                    >
                      {/* Show "Saving..." while the request is in progress */}
                      {formik.isSubmitting ? "Saving..." : editingProduct ? "Update" : "Create"}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div
          className="modal show d-flex"
          style={{ background: "rgba(0,0,0,0.5)", position: "fixed", inset: 0, zIndex: 300, alignItems: "center", justifyContent: "center" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Product?</h5>
                <button className="btn-close" onClick={() => setDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
}

export default AdminProducts;