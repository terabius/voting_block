import {
    Button,
  FieldPickerSynced,
  initializeBlock,
  useBase,
  useRecords,
  expandRecord,
  TextButton,
  TablePicker,
  useGlobalConfig,
  TablePickerSynced,
} from "@airtable/blocks/ui";

import React, { useState } from "react";


function TodoBlock() {
    // YOUR CODE GOES HERE
    const [vote, setVote] = useState(5);
    const base = useBase();    
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get("selectedTableId");
    const completedFieldId = globalConfig.get("completedFieldId");
    const table = base.getTableByIdIfExists(tableId);
    const completedField = table ? table.getFieldByIdIfExists(completedFieldId) : null;
    const records = useRecords(table);

    const updateVote = (record) =>{

       if(vote>0){
        let value = record.getCellValue("vote");
        let newValue = value+1
        table.updateRecordAsync(record, { 'vote': newValue }); 

        setVote(vote-1);
        
        }      
    }

    const removeVote = (record) =>{
       if (vote > 0) {
         let value = record.getCellValue("vote");
         let newValue = value + 1;
         table.updateRecordAsync(record, { vote: newValue });

         setVote(vote - 1);
       }     
    }

    const tasks = records && completedFieldId ? records.map(record => (
         <div key={record.id}>
         <Task key={record.id} record={record} completedFieldId={completedFieldId} />

         <Button onClick={()=>updateVote(record)}>Vote</Button>
         </div>
    )): null;
    

    return (
      <>
        <div>{base.name}</div>
        <div>You have {vote} Votes left</div>
        {/* <TablePickerSynced globalConfigKey="selectedTableId" /> */}
        {/* <FieldPickerSynced table={table} globalConfigKey="completedFieldId" /> */}
        <div>{tasks}</div>
      </>
    );
    }


    function Task({record, completedFieldId}) {
        const label = record.name || 'Unnamed record';
 
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            padding: 12,
            borderBottom: "1px solid #ddd",
          }}
        ></div>
        {record.getCellValue(completedFieldId) ? <u>{label}</u> : label}

        <TextButton
          variant="dark"
          icon="expand"
          aria-label="Expand record"
          onClick={() => {
            expandRecord(record);
          }}
        />
        
      </div>
    );
    }

initializeBlock(() => <TodoBlock />);
