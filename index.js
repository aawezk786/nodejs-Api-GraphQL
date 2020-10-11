const express = require('express');
const {graphqlHTTP}  = require('express-graphql');
const app = express();
var {  GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString, graphql } = require('graphql');

const book = [
    {
        "_id": 1,
        "quantity": 1,
        "book_name": "Autobiography Of A Yogi"
    },
    {
        "_id": 2,
        "quantity": 1,
        "book_name": "Autogenic Therapy: Self-help for Mind and Body [Paperback] Bird, Jane and Pinch, Christine",
        
    },
    {
        "_id": 3,
        "quantity": 1,
        "book_name": "Autographs in the Rain (Bob Skinner series, Book 11): A suspenseful crime thriller of celebrity and murder [Paperback] Jardine, Quintin"
    },
    {
        "_id": 4,
        "quantity": 1,
        "book_name": "Available Light Photography Glanfield, Colin"
    }
]
const BookType = new GraphQLObjectType({
    name : 'Books',
    description: '...',
    fields: {
        _id : {
            type: GraphQLInt
        },
        quantity: {
            type: GraphQLInt
        },
        book_name:{
            type: GraphQLString
        }
    }
});
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Wassup',
        fields: () => ({
            book: {
                type: GraphQLList(BookType),
                resolve: (parent, args) => {
                    return book
                }
            },
            books: {
                type: BookType,
                args:{
                    _id : {
                        type: GraphQLInt
                    }
                },
                resolve: (parent, {_id}) => {
                    const bookdetail = book.filter(book => book._id == _id) 
                    return bookdetail[0]
                },
            },
        }),
    }),
});
app.use('/graphql',graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.get('/',(req,res,next)=>{
    const query = `query{book{_id book_name quantity}}`;
    graphql(schema,'{book{_id,book_name,quantity}}',query).then(response =>{
        res.send(response);
    }).catch(err=>{
        next(err)
    })
});

app.get('/:_id',(req,res,next)=>{
    const query = `query{books(_id : ${req.params._id}){_id,book_name,quantity}}`;
    graphql(schema,query)
        .then(response=>{
            res.send(response)
        })
        .catch(err=>{
            next(err)
        })
});

app.listen(3000,()=>{
    console.log('Server is listening')
})