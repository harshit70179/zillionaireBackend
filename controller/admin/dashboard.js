let db = require("../../config/db");
const { userType } = require("../../config/enum");

exports.dashboard = async (req, res) => {
    try {
        const user = await fetchUser();
        const main_category = await fetchMainCategory();
        const category = await fetchCategory();
        const sub_category = await fetchSubCategory();
        const banner = await fetchBanner();
        const products = await fetchProducts();
        const home_title = await fetchHomeTitle();

        let arr = [
            {
                user: user[0].user,
                main_category: main_category[0].main_category,
                category: category[0].category,
                sub_category: sub_category[0].sub_category,
                banner: banner[0].banner,
                products: products[0].products,
                home_title: home_title[0].home_title
            },
        ];
        return res.send({ status: true, data: arr });
    } catch (error) { }
};

async function fetchUser() {
    const query =
        "SELECT Count(id) AS user FROM user WHERE user_type NOT IN (?, ?)";
    return new Promise((resolve, reject) => {
        db.query(query, [userType.Admin, userType.Staff], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function fetchMainCategory() {
    const query =
        "SELECT Count(id) AS main_category FROM main_category";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function fetchCategory() {
    const query =
        "SELECT Count(id) AS category FROM category";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


async function fetchSubCategory() {
    const query =
        "SELECT Count(id) AS sub_category FROM sub_category";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function fetchProducts() {
    const query =
        "SELECT Count(id) AS products FROM products";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function fetchBanner() {
    const query =
        "SELECT Count(id) AS banner FROM banner";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function fetchHomeTitle() {
    const query =
        "SELECT Count(id) AS home_title FROM home_title";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

