/*global describe,it,element,by,takeScreenshot,browser,expect*/

describe("sap.m.PlanningCalendarAppointmentSize", function() {
	"use strict";

	browser.testrunner.currentSuite.meta.controlName = 'sap.m.PlanningCalendar';

	it("should render the whole page", function() {
		expect(takeScreenshot()).toLookAs("calendar_appointment_size");
	});

	it("should render the appointment with Half-Size", function() {
		element(by.id("select_height")).click();
		element(by.cssContainingText(".sapMSelectListItem", "Half-Size")).click();

		expect(takeScreenshot()).toLookAs("calendar_appointment_size_halfSize_size");
	});

	it("should render the appointment with Large", function() {
		element(by.id("select_height")).click();
		element(by.cssContainingText(".sapMSelectListItem", "Large")).click();

		expect(takeScreenshot()).toLookAs("calendar_appointment_size_large_size");
	});

	it("should render the appointment with Automatic", function() {
		element(by.id("select_height")).click();
		element(by.cssContainingText(".sapMSelectListItem", "Automatic")).click();

		expect(takeScreenshot()).toLookAs("calendar_appointment_size_automatic_size");
	});

	it("should render the appointment with Regular", function() {
		element(by.id("select_height")).click();
		element(by.cssContainingText(".sapMSelectListItem", "Regular")).click();

		expect(takeScreenshot()).toLookAs("calendar_appointment_size_regular_size");
	});

	it("should render the appointment with ReducedHeight", function() {
		element(by.id("reduced_height")).click();

		expect(takeScreenshot()).toLookAs("calendar_appointment_size_reduced_height_size");
	});
});
