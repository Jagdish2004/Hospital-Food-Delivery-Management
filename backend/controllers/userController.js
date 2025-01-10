const User = require('../models/User');

const getDeliveryStaff = async (req, res) => {
    try {
        const deliveryStaff = await User.find({ 
            role: 'delivery',
            active: true 
        }).select('name email');
        
        if (!deliveryStaff) {
            return res.status(404).json({ message: 'No delivery staff found' });
        }
        
        res.json(deliveryStaff);
    } catch (error) {
        console.error('Error in getDeliveryStaff:', error);
        res.status(500).json({ 
            message: 'Error fetching delivery staff',
            error: error.message 
        });
    }
};

module.exports = {
    getDeliveryStaff
}; 