# Project Running Procedures

## Running Yelpcamp

1. Clone the [repo](https://github.com/mamun-0/yelpcamp.git)
2. Open 💻 terminal at the cloned location and type `npm install`

# Environmental Variables

| Keys                       | Values(Create your own key and set)                       | Description|
| -------------------------- | --------------------------------------------------------- |-------------|
| MONGO_URL | mongodb+srv://my_db:<password>@cluster0.op3av82.mongodb.net/?retryWrites=true&w=majority |[Mongodb Atlas](https://www.mongodb.com/atlas/database) create mongo atlas make sure the ip issue.
| CLOUD_NAME | [Cloudinary](https://cloudinary.com/)     | Create account for collecting secret key|
| API_KEY | [Cloudinary](https://cloudinary.com/)        | Create account for collecting secret key|
| API_SECRET | [Cloudinary](https://cloudinary.com/)     | Create account for collecting secret key|
| SESSION_SECRET | Your secret string                    | As your wish. May use `crypto.randomBytes(128).toString('hex')` into your node REPL |

### After running

![Image1](https://i.imgur.com/qgZYoQm_d.webp?maxwidth=760&fidelity=grand)
![Image2](https://i.imgur.com/VrTLItU_d.webp?maxwidth=760&fidelity=grand)