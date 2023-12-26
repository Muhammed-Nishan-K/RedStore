const cartadb = require("../model/cartschema");
const orderdb = require("../model/orderSchema");
const productdb = require("../model/productSchema");
const Userdb = require("../model/usersSchema");
const Razorpay=require("razorpay")
const fs = require('fs'); // Use the promises version of fs for async/await
   const path = require('path');
   const PDFDocument = require('pdfkit');
const { log } = require("console");

const razorpayInstance = new Razorpay({
    key_id: process.env.key_id,
    seckey: process.env.seckey,
  });


exports.create=(req,res)=>{
    const price=req.session.price;

    if(req.session.prid){
        const payment=req.query.payment;
        const index=req.session.index;
        Userdb.findOne({email:req.session.email}).then((data1)=>{ 
    
            productdb.find({_id:req.session.prid}).then((data)=>{
                var dataproduct=data;
                dataproduct[0].quantity=1;
                console.log(dataproduct);
                const currentDate = new Date();
                const date1=currentDate.toISOString().split('T')[0]
                const neworder = new orderdb({
                    productName: data,
                    price:price,
                    email:req.session.email,
                    date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                    time: currentDate.toTimeString().split(' ')[0] ,
                    address:data1.address[index],
                    payment:payment,
                    day:date1[8]+date1[9],
                    month:date1[5]+date1[6],
                    year:date1[0]+date1[1]+date1[2]+date1[3]
                });
                neworder.save()
                productdb.updateOne({_id:req.session.prid},{$inc:{quantity:-1}}).then((data)=>{
                    cartadb.updateOne({email:req.session.email},{$set:{quantity:1}}).then((data)=>{
                        
                    })
                })
                if(req.query.payment=='wallet'){
                    Userdb.updateOne({email:req.session.email},{$inc:{wallet:-price}}).then((data)=>{
                        const amound=(parseInt(req.query.amound)/100)
                        const currentDate = new Date();
                        const wallet={
                            amount:price,
                            date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                            time: currentDate.toTimeString().split(' ')[0] ,
                            mode:"payment"
                        
                            }
                            Userdb.updateOne({email:req.session.email},{$push:{walletdetails:wallet}}).then((data)=>{

                            })
                    })
                }
                
                req.session.order=true;
            res.redirect("/order-sucess")
            })
        })  
    }else{
    const index=req.session.index;
    const payment=req.query.payment;

    
    Userdb.findOne({email:req.session.email}).then((data1)=>{ 

        cartadb.find({email:req.session.email}).then((data)=>{
            console.log(data);
            const currentDate = new Date();
            const date1=currentDate.toISOString().split('T')[0];

            const neworder = new orderdb({
                productName: data,
                price:price,
                email:req.session.email,
                date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                time: currentDate.toTimeString().split(' ')[0] ,
                address:data1.address[index],
                payment:payment,
                day:date1[8]+date1[9],
                month:date1[5]+date1[6],
                year:date1[0]+date1[1]+date1[2]+date1[3]
             
             
            });
            neworder.save()
            for(i=0;i<data.length;i++){
            productdb.updateOne({productName: data[i].productName},{$inc:{quantity: -data[i].quantity}}).then((data1)=>{
                cartadb.updateOne({productName: data[i].productName,email:req.session.email},{$set:{quantity:1}}).then((data)=>{
                        
                })

            })
            productdb.findOne({productName: data[i].productName}).then((data2)=>{
                if(data2.quantity==0){
                    cartadb.updateMany({productName: data2.productName,email:req.session.email},{$set:{quantity:0}}).then((data)=>{
                        
                    })
                }else{
                    cartadb.updateMany({productName: data2.productName,email:req.session.email},{$set:{quantity:1}}).then((data)=>{
                        
                    })
                }
            })
        }
        res.redirect("/")
        })
    })
}
    
}

exports.findad=(req,res)=>{
    orderdb.find({}).then((data)=>{
        res.send(data);
    })
}
exports.findod=(req,res)=>{
    orderdb.find({}).then((data)=>{
        res.send(data);
    })
}
exports.userod=(req,res)=>{
    orderdb.find({email:req.query.email}).then((data)=>{
        res.send(data);
    })
}

exports.change=(req,res)=>{
    orderdb.updateOne({_id:req.query.id},{status:req.body.exampleRadios}).then(async (data)=>{
        if(req.body.exampleRadios=='Canceled'){
            const price=await orderdb.findOne({_id:req.query.id})
            const currentDate = new Date();
            const wallet={
                amount:price.price,
                date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                time: currentDate.toTimeString().split(' ')[0] ,
                mode:"cancelorder"
            }
            await Userdb.updateOne({email:price.email},{$push:{walletdetails:wallet}})
    Userdb.updateOne({email:price.email},{$inc:{wallet:price.price}}).then((data)=>{

    }).catch(err=>{
        res.redirect('/err')
    })
        }
        res.redirect("/admin-order")
    })
}
exports.userwallet=(req,res)=>{
    const amound=(parseInt(req.query.amound)/100)
    const currentDate = new Date();
    const wallet={
        amount:amound,
        date: currentDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        time: currentDate.toTimeString().split(' ')[0] ,
        mode:"deposit"
    }
    Userdb.updateOne({email:req.session.email},{$push:{walletdetails:wallet}}).then((data)=>{
        Userdb.updateOne({email:req.session.email},{$inc:{wallet:amound}}).then((data)=>{
            res.redirect('/user-wallet')
        })
    })
}

exports.createpdf=async(req,res)=>{
    const id = req.query.id || 'default';  // Update this line based on your form data

  try {
      const filePath = await createpdf(id);
      res.download(filePath, 'Invoice.pdf', async (err) => {
          // Delete the temporary PDF file after it has been sent
          if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
          } else {
              await fs.unlinkSync(filePath);
          }
      });
  } catch (error) {
      console.error(`Error creating PDF: ${error}`);
      res.status(500).send('Internal Server Error');
  }
  
}

async function createpdf(id) {
    
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'sales_report.pdf');
    const data = await orderdb.findOne({ _id: id });

    const stream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('finish', () => {
            resolve(filePath);
        });

        doc.pipe(stream);

        // Add invoice header
        doc.fontSize(18).text('Invoice', { align: 'center' });
        doc.fontSize(18).text(' ');
        doc.fontSize(18).text(' ');

        // Add order details
        doc.fontSize(14).text('Order ID: ' + data._id, { align: 'right' });
        doc.fontSize(18).text(' ');
        doc.fontSize(18).text(' ');
        doc.fontSize(14).text('Products:', { align: 'left' });
        doc.fontSize(18).text(' ');

        // Loop through products and add details
        for (let i = 0; i < data.productName.length; i++) {
            const product = data.productName[i];
            doc.fontSize(12)
                .text('Product Name: ' + product.productName)
                .text('Price: ' + product.price)
                .text('Quantity: ' + product.quantity);
            doc.fontSize(18).text(' ');
            doc.fontSize(18).text(' ');
        }

        // Add order date
        doc.fontSize(18).text(' ');
        doc.fontSize(14).text('Date: ' + data.date, { align: 'right' });
        doc.fontSize(18).text(' ');
        doc.fontSize(18).text(' ');

        // Calculate total amount
        const totalAmount = data.price;

        // Add total amount to the invoice
        doc.fontSize(14).text('Total Amount: ' + totalAmount, { align: 'right' });

        // Add a line to separate details and total
        doc.moveDown().lineTo(0, doc.y).stroke();

        doc.end();
    });
}

    