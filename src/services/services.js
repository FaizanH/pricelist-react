import axios from "axios";
import firebase from "../firebase";
import deployment from "../deployment";

const createToken = async () => {
    const user = firebase.auth().currentUser;
    // console.log(user);
    const token = user && (await user.getIdToken());

    const payloadHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    return payloadHeader;
}

export const getUser = async () => {
    const header = await createToken();

    try {
      const res = await axios.get(deployment.localhost + "/auth/user", header);
      return res.data;
    } catch (e) {
      console.error(e);
    }
}

export const getUserByEmail = async (email) => {
    const header = await createToken();

    try {
        const res = await axios.post(deployment.localhost + "/users/email", {"email": email}, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const addUser = async (user) => {
    const header = await createToken();

    try {
        const res = await axios.post(deployment.localhost + "/users/add", user, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const createProduct = async (product) => {
    const header = await createToken();
    
    try {
        const res = await axios.post(deployment.localhost + "/products/add", product, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getProductById = async (id) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/id/" + id, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getProductBySku = async (sku) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/search?sku=" + sku, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getProducts = async (page, limit, q, cq) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products?page=" + page + "&limit=" + limit + "&q=" + q + "&custq=" + cq, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getPrices = async (page, limit, q, cq) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/prices?page=" + page + "&limit=" + limit + "&q=" + q + "&custq=" + cq, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getPricesBySku = async (sku) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/prices/search?sku=" + sku, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const updateProduct = async (product) => {
    const header = await createToken();

    try {
        const res = await axios.post(deployment.localhost + "/products/update", product, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const createPrice = async (product) => {
    const header = await createToken();
    
    try {
        const res = await axios.post(deployment.localhost + "/products/prices/add", product, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const deletePrice = async (sku, Customer) => {
    const header = await createToken();

    try {
        const res = await axios.delete(deployment.localhost + "/products/prices/" + sku + "/" + Customer);
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const updatePrice = async (product) => {
    const header = await createToken();

    try {
        const res = await axios.post(deployment.localhost + "/products/prices/update", product);
        return res.data;
    } catch (e) {
        console.error(e);
    }
}