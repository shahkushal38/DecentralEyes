import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ReviewSubmitted } from "../generated/schema"
import { ReviewSubmitted as ReviewSubmittedEvent } from "../generated/ToolReviewManager/ToolReviewManager"
import { handleReviewSubmitted } from "../src/tool-review-manager"
import { createReviewSubmittedEvent } from "./tool-review-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let toolId = BigInt.fromI32(234)
    let reviewer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let score = BigInt.fromI32(234)
    let newReviewSubmittedEvent = createReviewSubmittedEvent(
      toolId,
      reviewer,
      score
    )
    handleReviewSubmitted(newReviewSubmittedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ReviewSubmitted created and stored", () => {
    assert.entityCount("ReviewSubmitted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ReviewSubmitted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "toolId",
      "234"
    )
    assert.fieldEquals(
      "ReviewSubmitted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reviewer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ReviewSubmitted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "score",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
