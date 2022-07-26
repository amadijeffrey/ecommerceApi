const request = require('request')
const { initializePayment, verifyPayment } = require('../config/paystack')(request);

const paymentInitialize = (req, res) => {
    try {
        const { amount, email, firstName, lastName } = req.body
        const fullName = firstName + ' ' + lastName
        const form = { amount, email, fullName }
        form.metadata = {
            full_name: form.fullName
        }
        form.amount *= 100;
        initializePayment(form, (error, body) => {
            if (error) {
                //handle errors
                throw new Error(error)
            }
            response = JSON.parse(body);
            console.log(response)
            res.redirect(response.data.authorization_url)
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: 'something went wrong' })
    }
};

const paymentVerify = (req, res) => {
    try {
        const ref = req.query.reference;
        verifyPayment(ref, (error, body) => {
            if (error) {
                //handle errors appropriately
                throw new Error(error)
            }
            response = JSON.parse(body);
            const { reference } = response.data
            res.status(200).json({ status: 'success', reference, message: 'Your order has been received. It would be shipped soon.' })


        })
    } catch (err) {
        res.status(500).json({ status: 'fail', message: 'something went wrong' })
    }
}




module.exports = { paymentInitialize, paymentVerify }