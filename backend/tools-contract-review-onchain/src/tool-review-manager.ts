import {
  ReviewSubmitted as ReviewSubmittedEvent,
  ToolAdded as ToolAddedEvent
} from "../generated/ToolReviewManager/ToolReviewManager"
import { ReviewSubmitted, ToolAdded } from "../generated/schema"

export function handleReviewSubmitted(event: ReviewSubmittedEvent): void {
  let entity = new ReviewSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.toolId = event.params.toolId
  entity.reviewer = event.params.reviewer
  entity.score = event.params.score

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleToolAdded(event: ToolAddedEvent): void {
  let entity = new ToolAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.toolId = event.params.toolId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
