async function test() {
    try {
        const auth = await fetch('http://localhost:5000/api/users/auth', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@zamisprint.com', password: 'password123' }) 
        });
        const cookie = auth.headers.get('set-cookie');
        
        const ordersRes = await fetch('http://localhost:5000/api/orders', { headers: { Cookie: cookie } });
        const ordersData = await ordersRes.json();
        const order = ordersData.orders[0];
        
        console.log("Original Date:", order.createdAt);
        
        const updatedRes = await fetch(`http://localhost:5000/api/orders/${order._id}/billing`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ createdAt: '2026-06-01' })
        });
        const updatedData = await updatedRes.json();
        console.log("Response Date:", updatedData.createdAt);
        
        const ordersAfterRes = await fetch('http://localhost:5000/api/orders', { headers: { Cookie: cookie } });
        const ordersAfterData = await ordersAfterRes.json();
        const orderAfter = ordersAfterData.orders.find(o => o._id === order._id);
        
        console.log("Fetched After Date:", orderAfter.createdAt);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
test();
