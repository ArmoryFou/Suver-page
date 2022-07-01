const profiles = async (req, res, next) => { 
    const { id } = req.params; 

    const eResultado = await connection.query(`SELECT * FROM users WHERE id = $1`, {id}); 

    res.json(eResultado.rows[0]);
    
    
 }
