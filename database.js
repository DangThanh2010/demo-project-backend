const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

const dbMySQL = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    port: 3306,
});

try {
    dbMySQL.authenticate().then(
        console.log('Connection MySQL has been established successfully.')
    );
} catch (error) {
    console.error('Unable to connect to the database:', error);
}





class dbMongoDB {
  constructor() {
    this.uri = process.env.MONGODB_URL;
    this.onConnection();
  }

  onConnection() {
    this.connection = mongoose.connection;

    this.connection.on('connected', () => {
      console.log('Mongo Connection Established');
    });

    this.connection.on('reconnected', () => {
      console.log('Mongo Connection Reestablished');
    });

    this.connection.on('disconnected', () => {
      console.log('Mongo Connection Disconnected');
      console.log('Trying to reconnect to Mongo...');
      setTimeout(() => {
        mongoose.connect(this.uri, {
          keepAlive: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
          
          authSource: 'admin',
        });
      }, 3000);
    });
    this.connection.on('close', () => {
      console.log('Mongo Connection Closed');
    });

    this.connection.on('error', (error) => {
      console.log(`Mongo Connection Error${error}`);
    });

    const run = async () => {
      await mongoose.connect(this.uri, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
        authSource: 'admin',
      });
    };

    run().catch((error) => console.log(error));
  }
}


module.exports = {dbMySQL, dbMongoDB};

