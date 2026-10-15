import XCTest

final class DemoWalkTests: XCTestCase {
    func testOwnerAndStaffWalkTheSeededDay() {
        let app = XCUIApplication()
        app.launch()

        app.buttons["Continue as Maria, owner"].tap()
        XCTAssertTrue(app.staticTexts["2 still open"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["10 customers brought in"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.tabBars.buttons["Café"].exists)

        open("booking-today-jennie", in: app)
        XCTAssertTrue(app.staticTexts["Together by the window"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["Two cups on the table"].exists)
        XCTAssertTrue(app.staticTexts["Both students are inside."].exists)

        app.staticTexts["Ateneo de Manila University"].firstMatch.tap()
        XCTAssertTrue(app.staticTexts["Verified"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["Email, phone, ID, and emergency contact stay off this screen."].exists)
        app.navigationBars.buttons["Date"].tap()

        app.buttons["Confirm date happened"].tap()
        XCTAssertTrue(app.staticTexts["Completed"].waitForExistence(timeout: 4))
        app.navigationBars.buttons["Today"].tap()
        XCTAssertTrue(app.staticTexts["12 customers brought in"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["1 still open"].exists)

        open("booking-today-aria", in: app)
        XCTAssertTrue(app.staticTexts["Waiting for the students to share these photos."].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["No photos for this task."].exists)
        XCTAssertTrue(app.staticTexts["One student is inside."].exists)
        app.navigationBars.buttons["Today"].tap()

        app.tabBars.buttons["Alerts"].tap()
        open("alert-report-report-pending", in: app)
        XCTAssertTrue(app.buttons["Confirm report"].waitForExistence(timeout: 4))
        app.buttons["Confirm report"].tap()
        XCTAssertTrue(app.descendants(matching: .any)["report-location"].waitForExistence(timeout: 4))
        app.navigationBars.buttons["Alerts"].tap()

        app.tabBars.buttons["Café"].tap()
        XCTAssertTrue(app.buttons["cafe-section-menu"].waitForExistence(timeout: 4))
        app.buttons["cafe-section-menu"].tap()
        XCTAssertTrue(app.buttons["tier-and-billing"].waitForExistence(timeout: 4))
        app.buttons["tier-and-billing"].tap()
        XCTAssertTrue(app.staticTexts["Senior"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["12 of 500 customers"].waitForExistence(timeout: 4))
        XCTAssertTrue(app.staticTexts["Free until 500 customers. Then the monthly fee starts."].exists)
        XCTAssertFalse(app.buttons["Pay"].exists)

        app.tabBars.buttons["Today"].tap()
        app.buttons["Sign out"].tap()

        app.buttons["Continue as Paolo, staff"].tap()
        XCTAssertTrue(app.staticTexts["1 still open"].waitForExistence(timeout: 4))
        XCTAssertFalse(app.tabBars.buttons["Café"].exists)
        XCTAssertTrue(app.tabBars.buttons["Alerts"].exists)
    }

    private func open(_ identifier: String, in app: XCUIApplication) {
        let match = app.descendants(matching: .any)[identifier]
        XCTAssertTrue(match.waitForExistence(timeout: 4))
        match.tap()
    }

}
