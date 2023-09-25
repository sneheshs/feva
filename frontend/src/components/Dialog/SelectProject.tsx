import { Project } from '../../interfaces/projects';
import { useState } from 'react';

export default function DialogSelectProject() {
    const [projects, setProjects] = useState<Project[] | null>();
    return (      
        <dialog className="modal_select_project">
            {
                projects ? 
                <AddProject /> :
                <ProjectList />
            }
        </dialog>
    )
}

const AddProject: React.FC = () => {
    return (
        <div></div>
    )
}

const ProjectList: React.FC = ({  }) => {
    return (
        <div></div>
    )
}

//         <div id={'dialog-click-container'}
// onClick={(e) => {
//     if (e.target.class != 'dailog-fixed-height-container') {
//         this.setState({
//             showProjectListDialog: false
//         })
//     }
// }}>
// {this.state.showProjectListDialog ? <TileDiv list={interfaceManager.toolbarManager.projectList} dataType={'project'} /> : null}
// </div                 

//                     {this.state.showNewProjectDialog ?
//                         <div className={'proj-selector'}>
//                             <div id={'click-container-project'}
//                                 onClick={(e) => {
//                                     this.setState({
//                                         showNewProjectDialog: false
//                                     })
//                                 }}>
//                                 <NewProj />
//                             </div>
//                         </div> : null}
//                 </div>