import * as React from 'react'
import { Icon,Badge } from 'antd';
import Style from './InterfaseMenu.less'
import {
	DragSource,
	DropTarget,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
} from 'react-dnd'





const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	}
}

const cardTarget = {
  drop(props,monitor,component){
		if (!component) {
			return null
		}
    const dragIndex = monitor.getItem().index
		const hoverIndex = props.index
		if (dragIndex === hoverIndex) {
			return
		}
    props.onChangeSort(dragIndex,hoverIndex)
  },
	// hover(props,monitor,component){
	// 	if (!component) {
	// 		return null
	// 	}
	// 	const dragIndex = monitor.getItem().index
	// 	const hoverIndex = props.index
	// 	if (dragIndex === hoverIndex) {
	// 		return
	// 	}
	// 	console.log(props)
	// }
}



@DropTarget("menu-item", cardTarget, (connect: DropTargetConnector) => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(
	"menu-item",
	cardSource,
	(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}),
)
export default class Card extends React.Component{
	 render() {
		const {
			interfase,
			isDragging,
			connectDragSource,
			connectDropTarget,
      project
		} = this.props
		const opacity = isDragging ? 0 : 1

		return (
			connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(<div className={Style.item} style={{  opacity }}>

              {(interfase.proxyType>0&&project.info.mockType||project.info.mockType===2)&&<Badge className={Style.badge} status="success"></Badge>}
              {interfase.name}&emsp;
              {project.permission>2&&<span className={Style.icon}>
                  <Icon interfase={interfase} onClick={(e)=>this.props.onEdit(interfase,e)}  type="form" />
                  <Icon interfase={interfase} onClick={(e)=>this.props.onDelete(interfase.id,e)}  type="delete" />
                </span>}

        </div>),
			)
		)
	}
}
