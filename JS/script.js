const width =document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;
gorizontal_size=(width)/112;
document.documentElement.style.setProperty('--size',`${Math.min(gorizontal_size,10)}px`);
let data,sort_data;
let attribute = ["id","name","zipcode","city"];
let last_clicked=null, clear_sort_clicked=0;
document.getElementById("but-download").classList.add("activity-button");
function createlem(config ={})
{
    const 
    {
        tagname="div",
        styles={},
        events={},
        children=[],
        ...rest
    } = config;
    let res=document.createElement(tagname);
    for(const[key,value] of Object.entries(styles))
    {
        res.style[key]=value;
    }
    for (const[event,handler] of Object.entries(events))
    {
        res.addEventListener(event,handler);
    }
    for(const element of children)
    {
        res.appendChild(element);
    }
    for(const [key,value] of Object.entries(rest))
    {
        if(key==="class")
        {
            res.classList.add(value);
            continue;
        }
        res[key]=value;
    }
    return res;
}
function create_display_question()
{
    let res = 
    createlem({tagname:"div",class:"display_question_container",
        children:[createlem({tagname:"label",style:"grid-area:1/1/2/3;",innerText:"ВІДОБРАЗИТИ ВАШ ВАРІНАТ ТАБЛИЦІ?"}),
        createlem({tagname:"button",classList:"button_yes activity-button",innerText:"ТАК",id:"button_yes"}),
        createlem({tagname:"button",classList:"button_no activity-button",innerText:"НІ",id:"button_no"})
        ]}
    )
    return res;
}
function clear()
{
    document.getElementById("but-download").addEventListener("click",load,{once:true});
    clickability("but-clear",0.5);
    clickability("but-download",-1);
    document.querySelector(".display_question_container").remove();
    document.getElementById("enter_url").value="";
    document.getElementById("label_result").remove();
    if(document.getElementById("display_sort"))
    {
        document.getElementById("display_sort").remove();
        document.getElementById("data_table").remove();
    }
}
function show_no()
{
    document.querySelector(".display_question_container").remove();
    document.getElementById("enter_url").value="";
    document.getElementById("label_result").remove();
    if(document.getElementById("display_sort"))
    {
        document.getElementById("display_sort").remove();
        document.getElementById("data_table").remove();
    }
    clickability("but-clear");
    clickability("but-download");
    document.getElementById("but-download").addEventListener("click",load,{once:true});
    document.getElementById("but-clear").removeEventListener("click",clear);
}
function deepfind(obj,targetkey)
{
    if(typeof(obj)!== 'object' || obj===null)
    {
        return undefined;
    }
    if (obj.hasOwnProperty(targetkey)) 
    {
        return obj[targetkey];
    }
    let result = undefined;
    for(let k in obj)
    {
        if(typeof(obj[k])=='object')
        {
            result = deepfind(obj[k],targetkey);
            if(result!==undefined)
            return result;
        }
    }
    return undefined;
}
function clickability(id)
{
    if(document.getElementById(id).style.filter==="")
    {
        document.getElementById(id).style.filter='brightness(1.2) saturate(0.25)';
    }
    else
    {
        document.getElementById(id).style.filter=null;
    }
    if(document.getElementById(id).classList.contains("activity-button"))
    {
        document.getElementById(id).classList.remove("activity-button");
    }
    else
    {
        document.getElementById(id).classList.add("activity-button");
    }
}
function sort_by_attribute(atrb)
{
    let atr = attribute[atrb];
    return function()
    {
        if(last_clicked!==`sort-${atrb+1}`|| clear_sort_clicked===0)
        {
            sort_data.sort((a,b) => {if(deepfind(a,atr)<deepfind(b,atr)) return -1; if(deepfind(a,atr)>deepfind(b,atr)) return 1; return 0; })
            show_vaues(sort_data);
        }
        else
        {
            sort_data.reverse();
            show_vaues(sort_data);
        }
        const targ=document.getElementById(`sort-${atrb+1}`);
        targ.style="background-color:#e34cb9";
        if(last_clicked!==null&&last_clicked!==`sort-${atrb+1}`)
        {
            const last=document.getElementById(last_clicked)
            last.style.backgroundColor="#0f90a2";
        }
        last_clicked=`sort-${atrb+1}`;
        if(clear_sort_clicked===0)
        {
            clear_sort_clicked=1;
            clickability("clear-sort");
            document.getElementById("clear-sort").addEventListener("click",clear_sort,{once:true})
        }
    }
}
function show_vaues(data)
{
    let data_table_div=document.getElementById("data_table");
    if(data_table_div.children.length===4)
    {
        for(let i=0;i<data.length;i++)
            {
                let elem,colors=["#c5ecf2","#9ed2ef"];
                for(let j=0;j<4;j++)
                {
                    elem = createlem({tagname:"div",classList:"attribute_field",style:`background-color:${colors[i%2]};font-size:calc(var(--size)*2.5);color: #4a7c8a;white-space:nowrap;`,innerText:`${deepfind(data[i],attribute[j])}`})  
                    elem.addEventListener('wheel', function (e) {
                        if (e.deltaY !== 0) 
                        {
                            e.preventDefault();
                            this.scrollLeft += e.deltaY;
                        }
                    }, { passive: false });
                    data_table_div.appendChild(elem);       
            }    
        }
    }
    else
    {
        let y=0;
        for(let element of data_table_div.children)
        {
            if(y>3)
            element.innerText=deepfind(data[Math.trunc(y/4-1)],attribute[y%4]);
            y++;
        } 
    }
}
function show_data()
{
    let display_sort =
    createlem({tagname:"div",id:"display_sort",style:"display:grid;grid-template-columns:repeat(4,calc(var(--size)*26));gap:var(--size);align-items:end;",children:
        [createlem({tagname:"label",innerText:"ТАБЛИЦЯ ДЛЯ ВАРІАНТУ 5",style:"grid-area:1/1/2/3"}),
         createlem({tagname:"button",innerText:"ОЧИСТИТИ СОРТУВАННЯ",id:"clear-sort",style:"grid-area:1/4/2/5;background-color:#e10c26;font-size:calc(var(--size)*1.8);color:white;filter:brightness(1.2) saturate(0.25);"})]
    })
    let data_table_div = 
    createlem({tagname:"div",id:"data_table",style:"display:grid;grid-template-columns:repeat(4,calc(var(--size)*26));justify-items:center;gap:var(--size);",children:
        [createlem({tagname:"button",classList:"sort_atribute activity-button",id:"sort-1",children:
            [createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↑"}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*2.5);",innerText:`${attribute[0]}`}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↓"})]}),
        createlem({tagname:"button",classList:"sort_atribute activity-button",id:"sort-2",children:
            [createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↑"}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*2.5);",innerText:`${attribute[1]}`}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↓"})]}),
        createlem({tagname:"button",classList:"sort_atribute activity-button",id:"sort-3",children:
            [createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↑"}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*2.5);",innerText:`${attribute[2]}`}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↓"})]}),   
        createlem({tagname:"button",classList:"sort_atribute activity-button",id:"sort-4",children:
            [createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↑"}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*2.5);",innerText:`${attribute[3]}`}),
            createlem({tagname:"p",style:"color:white;font-size:calc(var(--size)*4.5);",innerText:"↓"})]})],               
        })
    document.querySelector("section").appendChild(display_sort);
    document.querySelector("section").appendChild(data_table_div);
    show_vaues(data);
    for(let i=1;i<=4;i++)
    {
            document.getElementById(`sort-${i}`).addEventListener("click",sort_by_attribute(i-1));
    }
    clickability("button_yes");
    return;
}
function clear_sort()
{
    const data_table_div = document.getElementById("data_table");
    let y=0;
    for(let element of data_table_div.children)
    {
        if(y>3)
        element.innerText=deepfind(data[Math.trunc(y/4-1)],attribute[y%4]);
        y++;
    }
    let last=document.getElementById(last_clicked);
    last.style=style="backround-color:#0f90a2;"
    last.classList.add("activity-button");
    clickability("clear-sort");
    clear_sort_clicked=0;
}
async function load()
{
    //let url=document.getElementById("enter_url").value;
    let url="https://jsonplaceholder.typicode.com/users";
    try
    {
        const response = await fetch(url);
        if(!response.ok)
        {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        let result = await response.json();
        data=result;
        sort_data=[...data];
        const label_result = document.createElement("label");
        label_result.id="label_result";
        label_result.classList.add("result_label");
        label_result.innerText=`ДАНІ ФОРМАТУ JSON УСПІШНО ЗАВАНТАЖЕНО. КІЛЬКІСТЬ ЗАПИСІВ РІВНА ${data.length}.`;
        document.getElementById("downloads_container").appendChild(label_result);
        clickability("but-clear");
        clickability("but-download");
        document.getElementById("but-clear").addEventListener("click",clear,{once:true});
        document.querySelector("section").appendChild(create_display_question());
        document.getElementById("button_yes").addEventListener("click",show_data,{once:true});
        document.getElementById("button_no").addEventListener("click",show_no,{once:true});
    }
    catch(error)
    {
        console.error("Something went wrong: ",error);
        alert(`Error: ${error.message}`);
        document.getElementById("but-download").addEventListener("click",load,{once:true});
    }
}
document.getElementById("but-download").addEventListener("click",load,{once:true});
