import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ReviewSubmitted,
  ToolAdded
} from "../generated/ToolReviewManager/ToolReviewManager"

export function createReviewSubmittedEvent(
  toolId: BigInt,
  reviewer: Address,
  score: BigInt
): ReviewSubmitted {
  let reviewSubmittedEvent = changetype<ReviewSubmitted>(newMockEvent())

  reviewSubmittedEvent.parameters = new Array()

  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam("toolId", ethereum.Value.fromUnsignedBigInt(toolId))
  )
  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )
  reviewSubmittedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )

  return reviewSubmittedEvent
}

export function createToolAddedEvent(toolId: BigInt): ToolAdded {
  let toolAddedEvent = changetype<ToolAdded>(newMockEvent())

  toolAddedEvent.parameters = new Array()

  toolAddedEvent.parameters.push(
    new ethereum.EventParam("toolId", ethereum.Value.fromUnsignedBigInt(toolId))
  )

  return toolAddedEvent
}
