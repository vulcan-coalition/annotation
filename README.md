<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 1; ALERTS: 2.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>



# **Vulcan annotation category**


# Exemplar and Guideline




# Category and annotation

A category is a tree-based structural description of the annotations. In an informal vernacular, it describes all possible ways that users can answer. Users must provide annotation answers that strictly obey the structure imposed by the category tree. 

A category tree contains a variable hierarchy of choice nodes. A node, identified by a key, is either one of these types as specified by the `inputType` attribute:



* mutual - exactly one of the child choices must be selected. This is equivalent to a set of _[radio buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)_[^1] in the HTML5 framework. An answer to this type of node is one of the child nodes.

<table>
  <tr>
   <td>Category (mutual)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td rowspan="2" ><code>{ \
	inputType: <strong>mutual</strong>, \
	choices: [ \
		{ key: 1}, \
		{ key: 2} \
	] \
}</code>
   </td>
   <td><code>{key: 1}</code>
   </td>
  </tr>
  <tr>
   <td><code>{key: 2}</code>
   </td>
  </tr>
</table>




* multiple - any number of child choices can be selected. This is equivalent to a set of _[check boxes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)_[^2] in the HTML5 framework.

<table>
  <tr>
   <td>Category (multiple)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td rowspan="3" ><code>{ \
	inputType: <strong>multiple</strong>, \
	choices: [ \
		{ key: 1}, \
		{ key: 2}, \
		{ key: 3} \
	] \
}</code>
   </td>
   <td><code>[{key: 1}, {key: 2}]</code>
   </td>
  </tr>
  <tr>
   <td><code>[{key: 3}]</code>
   </td>
  </tr>
  <tr>
   <td><code>[]</code>
   </td>
  </tr>
</table>


Each choice of the multiple node can be individually marked as required. Through the node `required` boolean property.


<table>
  <tr>
   <td>Category (multiple)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td rowspan="3" ><code>{ \
	inputType: <strong>multiple</strong>, \
	choices: [ \
		{ key: 1,<strong> required</strong>: true}, \
		{ key: 2}, \
		{ key: 3} \
	] \
}</code>
   </td>
   <td><code>[{key: 1}, {key: 2}]</code>
   </td>
  </tr>
  <tr>
   <td><code>[{key: 1}, {key: 3}]</code>
   </td>
  </tr>
  <tr>
   <td><code>[{key: 1}]</code>
   </td>
  </tr>
</table>




* property - all child choices must be selected.

<table>
  <tr>
   <td>
Category (property)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td><code>{ \
	inputType: <strong>property</strong>, \
	choices: [ \
		{ key: 1}, \
		{ key: 2}, \
		{ key: 3} \
	] \
}</code>
   </td>
   <td><code>[{key: 1}, {key: 2}, {key: 3}]</code>
   </td>
  </tr>
</table>


In the last case where the node type is a property, it might seem absurd to answer all the choices. In reality, a property node never appears on its own without a child hierarchy.


<table>
  <tr>
   <td>Category (hierarchy)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td><code>{ \
	inputType: <strong>property</strong> \
	choices: [</code>
<code>        { key: 1 },</code>
<p>
<code>        { key: 2 },</code>
<p>
<code>        {</code>
<p>
<code>          key:3,</code>
<p>
<code>          inputType: <strong>mutual</strong>,</code>
<code>          choices: [ \
            { key: red }, \
            { key: green } \
          ]</code>
<p>
<code>        } \
	] \
}</code>
   </td>
   <td><code>[</code>
<p>
<code>  {key: 1}, </code>
<p>
<code>  {key: 2}, </code>
<p>
<code>  {</code>
<p>
<code>    key: 3,</code>
<p>
<code>    value: { key: red }</code>
<p>
<code>  }</code>
<p>
<code>]</code>
   </td>
  </tr>
</table>


This is where the “property” node type is made use. A property node is considered “selected” if and only if all its child nodes are “selected”.

Since a node may contain child nodes. Each child node can therefore be a hierarchy tree of its own that may contain `inputType` and `choices`. There is no limit to the depth of the hierarchy. 


<table>
  <tr>
   <td>Category (hierarchy)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td rowspan="4" ><code>{ \
	inputType: <strong>multiple</strong> \
	choices: [</code>
<code>        { key: 1 },</code>
<p>
<code>        {</code>
<p>
<code>          key: 2,</code>
<p>
<code>          inputType: <strong>property</strong>,</code>
<code>          choices: [ \
            { </code>
<p>
<code>              key: color </code>
<p>
<code>              inputType: <strong>mutual</strong>,</code>
<code>              choices: [</code>
<p>
<code>                {key: red},</code>
<p>
<code>                {key: green}</code>
<p>
<code>              ]</code>
<p>
<code>            }, \
            { </code>
<p>
<code>              key: sex  \
              inputType: <strong>mutual</strong>,</code>
<code>              choices: [</code>
<p>
<code>                {key: male},</code>
<p>
<code>                {key: female}</code>
<p>
<code>              ] \
            } \
          ]</code>
<p>
<code>        } \
	] \
}</code>
   </td>
   <td><code>[</code>
<p>
<code>  {key: 1}, </code>
<p>
<code>  {</code>
<p>
<code>    key: 2,</code>
<p>
<code>    value: [</code>
<p>
<code>      {</code>
<p>
<code>        key: color,</code>
<p>
<code>        value: { key: red }</code>
<p>
<code>      },</code>
<p>
<code>      {</code>
<p>
<code>        key: sex,</code>
<p>
<code>        value: { key: female }</code>
<p>
<code>      }</code>
<p>
<code>    ]</code>
<p>
<code>  }</code>
<p>
<code>]</code>
   </td>
  </tr>
  <tr>
   <td><code>[]</code>
   </td>
  </tr>
  <tr>
   <td><code>[</code>
<p>
<code>  {key: 1}</code>
<p>
<code>]</code>
   </td>
  </tr>
  <tr>
   <td><code>[</code>
<p>
<code>  {</code>
<p>
<code>    key: 2,</code>
<p>
<code>    value: [</code>
<p>
<code>      {</code>
<p>
<code>        key: color,</code>
<p>
<code>        value: { key: green }</code>
<p>
<code>      },</code>
<p>
<code>      {</code>
<p>
<code>        key: sex,</code>
<p>
<code>        value: { key: male }</code>
<p>
<code>      }</code>
<p>
<code>    ]</code>
<p>
<code>  }</code>
<p>
<code>]</code>
   </td>
  </tr>
</table>


Example: node hierarchy in project “กรุงเทพ”

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")


Some nodes require special inputs. As of now, the only possible value of inputType is “text”. When “text” is specified as the inputType, that node must prompt users to provide string input when selected.



* text - a leaf node that requires string input.

Example: วันที่ใบเสร็จ is a node with inputType: “text”. วันที่ใบเสร็จ itself is a child of the “date” node.



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



<table>
  <tr>
   <td>Category (hierarchy)
   </td>
   <td>Valid annotation answers
   </td>
  </tr>
  <tr>
   <td rowspan="2" ><code>{ \
	inputType: <strong>multiple</strong> \
	choices: [</code>
<code>        { key: 1 },</code>
<p>
<code>        {</code>
<p>
<code>          key:2,</code>
<p>
<code>          inputType: <strong>property</strong>,</code>
<code>          choices: [ \
            { </code>
<p>
<code>              key: age,</code>
<p>
<code>              <strong>inputType</strong>: <strong>text</strong></code>
<code>            }, \
            { </code>
<p>
<code>              key: title,</code>
<p>
<code>              inputType: <strong>mutual</strong>,</code>
<code>              choices: [</code>
<p>
<code>                {key: mr},</code>
<p>
<code>                {key: ms}</code>
<p>
<code>              ] </code>
<p>
<code>            } \
          ]</code>
<p>
<code>        } \
	] \
}</code>
   </td>
   <td><code>[</code>
<p>
<code>  {key: 1},</code>
<p>
<code>]</code>
   </td>
  </tr>
  <tr>
   <td><code>[</code>
<p>
<code>  {</code>
<p>
<code>    key: 2,</code>
<p>
<code>    value: [</code>
<p>
<code>      {</code>
<p>
<code>        key: age,</code>
<p>
<code>        value: <strong>"30"</strong></code>
<code>      },</code>
<p>
<code>      {</code>
<p>
<code>        key: title,</code>
<p>
<code>        Value: { key: mr }</code>
<p>
<code>      }</code>
<p>
<code>    ]</code>
<p>
<code>  }</code>
<p>
<code>]</code>
   </td>
  </tr>
</table>



## Node metadata fields

Apart from the key, inputType, required, and choices, a node may contain other metadata fields to enrich the category when rendered in user interfaces, such as



* description
* color
* abbreviation

Example: the category in ถอดคำ 4 is decorated with color, description, and abbreviation.


## 


## Example category in json format for ถอดคำ 4


```
{
  "inputType": "multiple",
  "choices": [
      {
            "key": "speech",
            "inputType": "property",
            "metadata": {
                "abbreviation": "s"
            },
            "description": "เสียงพูดบรรยาย",
            "choices": [
                {
                    "key": "language",
                    "inputType": "multiple",
                    "description": "ภาษา",
                    "choices": [
                        {
                            "key": "thai",
                            "inputType": "text",
                            "metadata": {
                                "color": "F1E399"
                            },
                            "description": "ไทย"
                        },
                        {
                            "key": "other",
                            "metadata": {
                                "color": "B9C6B6"
                            },
                            "description": "ภาษาอื่น ๆ"
                        }
                    ]
                },
                {
                    "key": "emotion",
                    "inputType": "multiple",
                    "description": "อารมณ์",
                    "choices": [
                        {
                            "key": "anger",
                            "metadata": {
                                "color": "F1E399"
                            },
                            "description": "โกรธ"
                        },
                        {
                            "key": "sadness",
                            "metadata": {
                                "color": "C3CEF4"
                            },
                            "description": "เศร้า"
                        },
                        {
                            "key": "fear",
                            "metadata": {
                                "color": "B9C6B6"
                            },
                            "description": "กลัว"
                        },
                        {
                            "key": "hatred",
                            "metadata": {
                                "color": "ECC9A0"
                            },
                            "description": "เกลียด"
                        },
                        {
                            "key": "excitement",
                            "metadata": {
                                "color": "EBC7DA"
                            },
                            "description": "ตื่นเต้น"
                        },
                        {
                            "key": "happiness",
                            "metadata": {
                                "color": "C3DCB4"
                            },
                            "description": "ดีใจ"
                        },
                        {
                            "key": "norm",
                            "metadata": {
                                "color": "D7CBE5"
                            },
                            "description": "เฉย ๆ"
                        },
                        {
                            "key": "other",
                            "description": "อื่่น ๆ"
                        }
                    ]
                },
                {
                    "key": "gender",
                    "inputType": "multiple",
                    "description": "เพศ",
                    "choices": [
                        {
                            "key": "male",
                            "metadata": {
                                "color": "F1E399"
                            },
                            "description": "ชาย"
                        },
                        {
                            "key": "female",
                            "metadata": {
                                "color": "C3CEF4"
                            },
                            "description": "หญิง"
                        },
                        {
                            "key": "unspecific",
                            "metadata": {
                                "color": "B9C6B6"
                            },
                            "description": "อื่น ๆ"
                        }
                    ]
                },
                {
                    "key": "speaker",
                    "inputType": "multiple",
                    "description": "ผู้พูด",
                    "choices": [
                        {
                            "key": "main",
                            "metadata": {
                                "color": "F1E399"
                            },
                            "description": "พิธีกรหลัก"
                        },
                        {
                            "key": "support",
                            "metadata": {
                                "color": "C3CEF4"
                            },
                            "description": "แขกรับเชิญ"
                        },
                        {
                            "key": "other",
                            "metadata": {
                                "color": "B9C6B6"
                            },
                            "description": "คนอื่นๆ"
                        }
                    ]
                }
            ]
        },
        {
            "key": "bg",
            "metadata": {
                "abbreviation": "n"
            },
            "description": "มีเสียงรบกวนอื่นๆอยู่ด้วย เช่น เสียงเพลง เสียงประกอบ"
        }
    ]
}
```



## Example annotation answers for ถอดคำ 4 in json format


```
[
      {
          "key": "speech",
          "value": [
                {
                      "key": "language",
                      "value": [
                          {
                                "key": "thai",
                                "value": "sample text"
                          },
                          {
                                "key": "other"
                          }
                      ]
                },
                {
                      "key": "emotion",
                      "value": [
                          {
                                "key": "hatred"
                          },
                          {
                                "key": "anger"
                          },
                          {
                                "key": "happiness"
                          },
                          {
                                "key": "sadness"
                          },
                          {
                                "key": "other"
                          }
                      ]
                },
                {
                      "key": "gender",
                      "value": [
                          {
                                "key": "male"
                          },
                          {
                                "key": "unspecific"
                          },
                          {
                                "key": "female"
                          }
                      ]
                },
                {
                      "key": "speaker",
                      "value": [
                          {
                                "key": "support"
                          },
                          {
                                "key": "main"
                          },
                          {
                                "key": "other"
                          }
                      ]
                }
          ]
      },
      {
          "key": "bg"
      }
]
```



## Category grammar


<table>
  <tr>
   <td><code>category ≜ (</code>
<p>
<code>	inputType</code>
<p>
<code>	choices</code>
<p>
<code>)</code>
   </td>
  </tr>
  <tr>
   <td><code>choices ≜ [node]</code>
   </td>
  </tr>
  <tr>
   <td><code>node ≜ (</code>
<p>
<code>	key</code>
<p>
<code>	inputType?</code>
<p>
<code>	choices?</code>
<p>
<code>	description?</code>
<p>
<code>	metadata?</code>
<p>
<code>	required?</code>
<p>
<code>)</code>
   </td>
  </tr>
  <tr>
   <td><code>inputType ⊂ { "mutual", "multiple", "property", "text" }</code>
   </td>
  </tr>
  <tr>
   <td><code>key</code> is a string.
   </td>
  </tr>
  <tr>
   <td><code>description</code> is a string.
   </td>
  </tr>
  <tr>
   <td><code>metadata is an object.</code>
   </td>
  </tr>
  <tr>
   <td><code>required</code> <code>⊂ { </code>True<code>, False }</code>
   </td>
  </tr>
</table>



## Annotation grammar


<table>
  <tr>
   <td><code>annotation ⊂ { list_of_nodes, node }</code>
   </td>
  </tr>
  <tr>
   <td><code>list_of_nodes ≜ [node]</code>
   </td>
  </tr>
  <tr>
   <td><code>node ≜ (</code>
<p>
<code>	key</code>
<p>
<code>	value?</code>
<p>
<code>)</code>
   </td>
  </tr>
  <tr>
   <td><code>value ⊂ { </code>string<code>, list, node }</code>
   </td>
  </tr>
</table>



# Programming guideline

It is common to write a recursive class object to represent a hierarchy structure. This goes to our category as well. 

We are going to define a Choice class for handling user interaction. Here the class choice contains references to all of its child choices and also a reference to its parent. 


## Class Choice:

Class choice has two prominent states: UI and selection.


<table>
  <tr>
   <td><code>ui_state ⊂ { expanded, collapsed }</code>
   </td>
  </tr>
  <tr>
   <td><code>is_selected ⊂ { </code>True<code>, False }</code>
   </td>
  </tr>
</table>


A choice is initiated by a json category description. 


<table>
  <tr>
   <td><strong><code>Function constructor(category):</code></strong>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>for</strong> choice in category.choices:</code>
<code>        child = new Choice(choice) \
        children.add(child) \
        child.parent = this</code>
<p>
<code>    key = category.key if key in category else null  \
    inputType = category.inputType \
    required = category.required if category.required is not null else False \
 \
    //initialize UI</code>
   </td>
  </tr>
</table>


When users select (or deselect) a choice, it will invoke the following routine:


```
expand_ui() //showing choices to users
if inputType == null:
    is_selected = !is_selected
    // must also update UI
parent.on_select(this)
```


This in turn calls parent.on_select to propagate the selection event.


<table>
  <tr>
   <td><strong><code>Function on_select(selected_child):</code></strong>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>if</strong> inputType == "mutual":</code>
<code>        <strong>for</strong> child <strong>in</strong> children: \
            <strong>if</strong> child != selected_child:</code>
<code>                child.deselect()</code>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>if</strong> conditions_met():</code>
<code>        select() //is_selected = true and update ui</code>
<p>
<code>    <strong>else</strong>:</code>
<code>        deselect() //is_selected = false and update ui</code>
<p>
<code>    parent.on_select(this)</code>
   </td>
  </tr>
</table>



<table>
  <tr>
   <td><strong><code>Function conditions_met():</code></strong>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>if</strong> inputType == "mutual":</code>
<code>        <strong>for</strong> child <strong>in</strong> children:</code>
<code>            <strong>if</strong> child.is_selected():</code>
<code>                <strong>return</strong> True \
        <strong>return</strong> False</code>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>else</strong> <strong>if</strong> inputType == "property":</code>
<code>        <strong>for</strong> child <strong>in</strong> children:</code>
<code>            <strong>if</strong> not child.is_selected():</code>
<code>                <strong>return</strong> False</code>
<code>        <strong>return</strong> True</code>
   </td>
  </tr>
  <tr>
   <td><strong><code>    else if inputType == "multiple":</code></strong>
<code>        <strong>for</strong> child <strong>in</strong> children:</code>
<code>            <strong>if</strong> child.required <strong>and</strong> not child.is_selected():</code>
<code>                <strong>return</strong> False</code>
<code>        <strong>return</strong> True</code>
   </td>
  </tr>
  <tr>
   <td><code>    </code>
<p>
<strong><code>    if inputType == "text":</code></strong>
<code>        <strong>return</strong> !is_text_empty()</code>
<code>    </code>
   </td>
  </tr>
  <tr>
   <td><code>    <strong>return</strong> True</code>
   </td>
  </tr>
</table>


Now that we have the category hierarchy, the next thing we are going to look into is how to get json annotation for submitting the user answer. We call this process compilation.


<table>
  <tr>
   <td><strong><code>Function compile():</code></strong>
   </td>
  </tr>
  <tr>
   <td><strong><code>if inputType == "text":</code></strong>
<code>    <strong>return</strong> { key: key, value: text}</code>
<strong><code>else if inputType == "mutual":</code></strong>
<code>    <strong>for</strong> child <strong>in</strong> children:</code>
<code>        <strong>if</strong> child.is_selected:</code>
<code>            <strong>return</strong> {</code>
<code>                       key: key,</code>
<p>
<code>                       value: child.compile()</code>
<p>
<code>                   }</code>
<p>
<strong><code>else if inputType == "multiple" or inputType == "property":</code></strong>
<code>    data = new Array</code>
<p>
<code>    <strong>for</strong> child <strong>in</strong> children:</code>
<code>        <strong>if</strong> child.is_selected:</code>
<code>            data.add(child.compile())</code>
<p>
<code>    <strong>return</strong> {</code>
<code>               key: key,</code>
<p>
<code>               value: data</code>
<p>
<code>           }</code>
<p>
<strong><code>else:</code></strong>
<code>    <strong>return</strong> { key: key }</code>
   </td>
  </tr>
</table>


Please note that at the top level, we **only** need the term “value” in the json annotation. Therefore when calling compile on the top level please do:


```
category.compile()["value"]
```


Next function is the decompilation process, which is the inverse of the compilation; namely, populating choices in the category hierarchy from a json annotation.


<table>
  <tr>
   <td><strong><code>Function decompile(annotation):</code></strong>
   </td>
  </tr>
  <tr>
   <td><code>select() //select self and update UI<strong> \
 \
if</strong> annotation.value <strong>is</strong> Array:</code>
<code>    <strong>for</strong> item <strong>in</strong> annotation.value: \
        <strong>for</strong> child in children:</code>
<code>            <strong>if</strong> item.key == child.key:</code>
<code>                child.decompile(item)</code>
<p>
<strong><code>else:</code></strong>
<code>    <strong>for</strong> child in children:</code>
<code>        <strong>if</strong> annotation.value.key == child.key:</code>
<code>            child.decompile(annotation.value)</code>
   </td>
  </tr>
</table>



<!-- Footnotes themselves at the bottom. -->
## Notes

[^1]:

     [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)

[^2]:

     [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
