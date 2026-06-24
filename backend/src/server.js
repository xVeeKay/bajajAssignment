import express from "express"
const app=express()
import cors from "cors"
app.use(cors())
const PORT= 3000

app.use(express.json())

app.post("/bfhl",(req,res)=>{
    const data = req.body.data

    if (!Array.isArray(data)) {
        return res.status(400).json({
            error: "data must be an array"
        });
    }
    const childParentMap=new Map()
    const seenNodeSet=new Set()
    const invalidEntries=[]
    const duplicateNodes=[]
    const graph= new Map()
    const childNodes=new Set()
    const allNodes=new Set()

    data.forEach((node)=>{
        const correctNode=node.trim()
        if(!/^[A-Z]->[A-Z]$/.test(correctNode)){
            invalidEntries.push(correctNode)
            return
        }
        if(correctNode[0]===correctNode[3]){
            invalidEntries.push(correctNode)
            return
        }
        if(seenNodeSet.has(correctNode)){
            duplicateNodes.push(correctNode)
            return
        }
        seenNodeSet.add(correctNode)
        const [parent,child]=correctNode.split("->")
        if(childParentMap.has(child)){
            return;
        }else{
            childParentMap.set(child,parent)
        }
        allNodes.add(parent)
        allNodes.add(child)
        childNodes.add(child)
        if(!graph.has(parent)){
            graph.set(parent,[])
        }
        graph.get(parent).push(child)
    })
    const undirectedGraph=new Map()
    for(const [parent,children] of graph){
        if(!undirectedGraph.has(parent)){
            undirectedGraph.set(parent,[])
        }
        for(const child of children){
            if(!undirectedGraph.has(child)){
                undirectedGraph.set(child,[])
            }
            undirectedGraph.get(parent).push(child)
            undirectedGraph.get(child).push(parent)
        }
    }
    const visited =new Set()
    const groups=[]
    function dfs(node, component) {
      visited.add(node);
      component.push(node);

      const neighbors = undirectedGraph.get(node) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      }
    }
    for (const node of allNodes) {
      if (!visited.has(node)) {
        const component = []

        dfs(node, component)

        groups.push(component)
      }
    }
    res.json({
      user_id: "vishalkumar_25052005",
      email_id: "vishal1592.be23@chitkarauniversity.edu.in",
      college_roll_number: "2311981592",

      invalid_entries: invalidEntries,
      duplicate_edges: [...new Set(duplicateNodes)],

      groups,

      graph: Object.fromEntries(graph),
    });
})





app.listen(PORT,()=>{
    console.log(`Server started on port: ${PORT}`)
})