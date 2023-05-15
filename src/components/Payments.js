import React from 'react'

const Payments = ({state,currentAccount}) => {
  const getToPay = async(groupAddress)=>{
      const {contract} = state;
      try {
          const [member,memberCount] = fetchGroupMember(groupAddress)
          const toPay = []
          for(let i = 0;i<memberCount;i++){
              const amount = await contract.methods.getToPay(currentAccount,member[i],groupAddress).call()
              toPay.push({group:groupAddress,to:member[i],amount:amount})
          }
      } catch (error) {
          console.log("Contract error",error)
      }
    }

  const fetchGroupMember = async(groupAddress)=>{
      const {contract} = state
      try {
          const GroupMember = await contract.methods.getMemberes(currentAccount).call()
          return GroupMember,GroupMember.length
      } catch (error) {
          console.log(`Cannot get group member of ${groupAddress}`,error)
      }
  }

  return (
    <div>Payments</div>
  )
}

export default Payments