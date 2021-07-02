// const CustomerPrice = React.forwardRef((props, ref) => (
//     <tr>
//         <td>{props.customer.Customer}</td>
//         <td>{props.product.sku}</td>
//         <td>{props.product.title}</td>
//         <td>
//             <Form.Control
//                 type="text"
//                 placeholder="Price"
//                 defaultValue={props.customer.Price}
//                 ref={ref}
//             />
//         </td>
//         <td>
//             <a href="#" onClick={() => { props.updateProduct(props.product._id, props.customer.Customer, ref.current.value) }}>update</a> |
//             <a href="#" onClick={() => { props.deleteProduct(props.product._id, props.customer.Customer) }}> delete</a>
//         </td>
//     </tr>
// ));

// export default class ManagePricing extends Component {
//     constructor(props) {
//         super(props);

//         this.updateProduct = this.updateProduct.bind(this);
//         this.deleteProduct = this.deleteProduct.bind(this);
//         this.updateProduct = this.updateProduct.bind(this);

//         // this.priceRef = React.createRef();
//         this.state = {
//             products: "",
//             update: false
//         }
//     }

//     componentDidMount() {
//         this.fetchData();
//     }

//     async fetchData() {
//         let res = await getProducts();
//         if (res) {
//             this.setState({
//                 products: res,
//                 update: false
//             });
//         }
//     }

//     async deleteProduct(prodid, Customer) {
//         console.log(Customer);
//         axios.delete(deployment.localhost + "/products/pricing/" + prodid + "/" + Customer)
//             .then(res => {
//                 console.log(res.data)
//                 this.setState({
//                     update: true
//                 });
//             });
//     }

//     async updateProduct(prodid, Customer, Price) {
//         console.log(Customer);
//         let payload = {
//             prodid,
//             Customer,
//             Price
//         }
//         axios.post(deployment.localhost + "/products/pricing", payload)
//             .then(res => {
//                 console.log(res.data)
//                 this.setState({
//                     update: true
//                 });
//             });
//     }

//     productsList() {
//         if (this.state.products != "") {
//             return this.state.products.map(currentproduct => {
//                 return currentproduct.pricing.map(currentcustomer => {
//                     return <CustomerPrice ref={React.createRef()} product={currentproduct} customer={currentcustomer} updateProduct={this.updateProduct} deleteProduct={this.deleteProduct} key={currentcustomer._id} />;
//                 })
//             });
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <p>Catalogue Management Page</p>
//                 <Form className="w-50">
//                     <InputGroup className="mb-3">
//                         <FormControl
//                             type="text"
//                             placeholder="Customer Name"
//                             // onChange={e => setCustomer(e.target.value)}
//                             // value={customer.Customer}
//                         />
//                         <FormControl
//                             type="text"
//                             placeholder="Product SKU"
//                             // onChange={e => setCustomer(e.target.value)}
//                             // value={customer.Customer}
//                         />
//                         <InputGroup.Append>
//                             <Button variant="primary" type="submit">Search</Button>
//                         </InputGroup.Append>
//                     </InputGroup>
//                 </Form>
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>Customer</th>
//                             <th>SKU</th>
//                             <th>Title</th>
//                             <th>Price</th>
//                             <th>Modify</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         { this.productsList() }
//                     </tbody>
//                 </Table>
//             </div>
//         );
//     }
// }