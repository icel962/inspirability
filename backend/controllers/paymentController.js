const db = require("../db/db");

// معالجة عملية دفع جديدة
exports.createPayment = (req, res) => {
    const user_id = req.user.id; // استخراج المعرف من JWT Token
    const { fees, duration, payment_method } = req.body;

    // 1. التأكد من أن المستخدم هو ولي أمر (Parent)
    db.query("SELECT parent_id FROM parent WHERE user_id = ?", [user_id], (err, parentData) => {
        if (err || parentData.length === 0) {
            return res.status(404).json({ message: "حساب ولي الأمر غير موجود" });
        }

        const parent_id = parentData[0].parent_id;

        // 2. إدخال البيانات في جدول payment الأساسي
        const query = "INSERT INTO payment (fees, duration, payment_method) VALUES (?, ?, ?)";
        db.query(query, [fees, duration, payment_method], (err, result) => {
            if (err) return res.status(500).json(err);

            const payment_id = result.insertId;

            // 3. ربط الدفع بولي الأمر في جدول subscription
            db.query("INSERT INTO subscription (payment_id, parent_id) VALUES (?, ?)", [payment_id, parent_id], (err) => {
                if (err) return res.status(500).json(err);

                res.json({
                    message: "تم تسجيل عملية الدفع والاشتراك بنجاح",
                    payment_details: { payment_id, fees, payment_method }
                });
            });
        });
    });
};

// جلب سجل المدفوعات الخاص بالمستخدم
exports.getMyPayments = (req, res) => {
    const user_id = req.user.id;

    const query = `
        SELECT p.* FROM payment p
        JOIN subscription s ON p.payment_id = s.payment_id
        JOIN parent pr ON s.parent_id = pr.parent_id
        WHERE pr.user_id = ?`;

    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};