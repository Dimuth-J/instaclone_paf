import React, { Component } from 'react';
import "./Post.css";
import { Avatar } from '@material-ui/core';
import postimage from "../../images/post.jpg"; 
import love from "../../images/love.svg"; 
import comment from "../../images/comment.svg"; 
import share from "../../images/share.svg"; 
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';



class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            commentList:[],
            liked: false,
            likeCount: this.props.likes,
         }
    }

    componentDidMount(){
        this.getComments();
    }

    likePost = (postId) => {
        const user = firebase.auth().currentUser;
        const likesRef = firebase.firestore().collection('likes').doc(postId);
    
        likesRef.collection(user.uid).doc('like').get()
          .then((doc) => {
            if (doc.exists) {
              // User has already liked the post, so remove like from Firestore
              likesRef.collection(user.uid).doc('like').delete()
                .then(() => {
                  this.setState({ liked: false, likeCount: this.state.likeCount - 1 });
                  console.log('Like removed from Firestore');
                })
                .catch((error) => {
                  console.error('Error removing like from Firestore:', error);
                });
            } else {
              // User has not yet liked the post, so add like to Firestore
              likesRef.collection(user.uid).doc('like').set({})
                .then(() => {
                  this.setState({ liked: true, likeCount: this.state.likeCount + 1 });
                  console.log('Like saved to Firestore');
                })
                .catch((error) => {
                  console.error('Error saving like to Firestore:', error);
                });
            }
          })
          .catch((error) => {
            console.error('Error checking if user has liked post:', error);
          });
      };

    getComments=()=>{ //API backend
        // let data=[
        //     {
        //         "username": "ASD",
        //         "commentId":"1234",
        //         "timeStamp":"123456",
        //         "description":"Comment 1"
        //     },
        //     {
        //         "username": "anindya",
        //         "commentId":"1234",
        //         "timeStamp":"123456",
        //         "description":"Comment 2"
        //     },
        //     {
        //         "username": "dasgupta",
        //         "commentId":"1234",
        //         "timeStamp":"123456",
        //         "description":"Comment 3"
        //     }
        // ];

        fetch('http://localhost:8080/comments/'+this.props.id)
            .then(response => response.json())
            .then(data => {
                this.setState({commentList: data});
        });
        
    }
    
    submitComments =(event) =>{
        if(event.key == "Enter") {
            let comment=event.currentTarget.value;
            if(comment!= null || comment!=undefined) {

                let payload = {
                    "commentId": Math.floor(Math.random()*1000000).toString(),
                    "userId": JSON.parse(localStorage.getItem("users")).uid,
                    "postId": this.props.id,
                    "timeStamp": new Date().getTime(),
                    "comment": comment
                }
    
                const requestOptions ={
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body : JSON.stringify(payload),
                }
    
                fetch("http://localhost:8080/comments",requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.getComments();
                })
                .catch(error =>{
    
                })

            }
        }
    }

    render() { 
        return ( 
        <div className="post__container">
            {/* Header */}
          <div className="post__header">
                <Avatar className="post__image" src="" />
                <div className="post__username">{this.props.userName}</div>
          </div>

          {/* Image */}
          <div>
              <img src={this.props.postImage} width="615px" /> 
          </div>

          {/* Analytics */}
          <div>
            <div style={{ marginLeft: "10px" }}>
                <img
                    src={love}
                    className="post_reactimage"
                    onClick={this.likePost}
                    style={{
                    filter: this.state.liked ? "brightness(0) invert(1)" : "",
                    }}
                />
                <img src={comment} className="post_reactimage" />
                <img src={share} className="post_reactimage" />
            </div>
            <div style={{ fontWeight: "bold", marginLeft: "20px" }}>
                {this.state.likeCount} likes
            </div>
        </div>

          {/* Comment Section */}
          <div>
              {
                  this.state.commentList.map((item,index)=>(
                      index < 4 ?
                        <div className="post_comment">{item.userName}: {item.comment}</div> :<span></span>
                  ))
              }
              <input text="text" onKeyPress={this.submitComments} className="post__commentbox" placeholder="Add a comment..." />
          </div>
          
        </div> 
        );
    }
}
 
export default Post;