const Order = require("../models/orders.js");
const OrderItem = require("../models/orderitem.js");
const { default: Stripe } = require("stripe");

const getAllOrders = async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    if (!orderList) {
      res.status(500).json({ success: false });
      return;
    }
    res.send(orderList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("name", "user");

    if (!order) {
      res.status(500).json({ success: false });
      return;
    }
    res.send(order);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createOrder = async (req, res) => {
  console.log(req.body);
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) return res.status(404).send("Order cannot be created");
    res.send(order);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!order) return res.status(404).send("Order cannot be updated");
    res.send(order);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (order) {
      await Promise.all(
        order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        })
      );
      return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).send({
      orderCount: orderCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res.status(400).send("The order sales cannot be generated");
    }
    res.send({ totalsales: totalSales.pop().totalsales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUsersOrders = async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList) {
      res.status(500).json({ success: false });
      return;
    }
    res.send(userOrderList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const stripe = new Stripe(
  "sk_test_51P8fRZSBZcJvq0CZevJM9r9OA0Z76OhQhCvVoNCVYADRlENYSoO74tFEdMuG3qsYPQgeceyxJDhrhKrEYSeRJ0O400hbC5CQBa"
);
const Stripepayment = async (req, res) => {
    try {
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items: req.body.map((item) => {
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
                images: [item.images],
              },
              unit_amount: item.price*100,
            },
            quantity: item.quantity,
          };
        }),
        success_url: `http://localhost:5173/success`,
        cancel_url: `http://localhost:5173/cancel`,
      };
      const session = await stripe.checkout.sessions.create(params);
      console.log('Session ID:', session.id);
      res.status(200).json(session.id);
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(error.statusCode || 500).json(error.message);
    }
  };
  

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderById,
  deleteOrderById,
  getOrderCount,
  getTotalSales,
  getUsersOrders,
  Stripepayment,
};
