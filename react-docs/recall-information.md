# What's Recall Information?
In conversational forms, you can use the answers that the user answered to display them in other questions labels. <br>
For example, if the first question is asking the user for his name, the user answers "John", wouldn't it be more conversational to use this name in any other following question for example to say "Great John, please type your email". <br>
This can be achieved easily with having this following question label like this: 
```
"Great {{field:field_id}}, please type your email"
```
**For sure, you should replace field_id with the actual field id **
  
