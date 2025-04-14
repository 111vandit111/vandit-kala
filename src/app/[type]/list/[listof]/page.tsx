"use client";
import React, { useState } from 'react'
import { SKILLS } from '../../../../../constants'
import SkillCard from '../../../../../lib/SkillCard'

const ListAll = () => {
 const [search , setSearch] = useState("");

 const listOfSkills = SKILLS.filter((skill) => {
    if(search === "") return true;
     return skill.description.toLowerCase().includes(search.toLowerCase()) || skill.name.toLowerCase().includes(search.toLowerCase());
 })
  return (
    <div className='px-10 py-20 mb-[120px] min-h-[calc(100vh-100px)]'>
        <input type="text" placeholder='Search' className='w-full max-w-[400px] mx-auto my-6' onChange={(e) => setSearch(e.target.value)} />
    <div className='flex flex-wrap gap-12 w-fit max-w-fit justify-center mx-auto'>
 
        {
            listOfSkills.map((skill , index) => {
                return (
                    <div key={index}>
                        <SkillCard {...skill} />
                    </div>
                )
            })
        }
    </div>
    </div>
  )
}

export default ListAll