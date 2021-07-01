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

export const getProductById = async (id) => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/id/" + id, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const getProducts = async () => {
    const header = await createToken();

    try {
        const res = await axios.get(deployment.localhost + "/products/", header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export const updateProduct = async (id, product) => {
    const header = await createToken();

    try {
        const res = await axios.post(deployment.localhost + "/products/update/" + id, product, header)
        return res.data;
    } catch (e) {
        console.error(e);
    }
}