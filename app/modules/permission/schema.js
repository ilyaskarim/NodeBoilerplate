export default `
	type Permission {
		_id: String
		id: Int
		action: String
		successMessage: String
		successMessageType: String
		errors: [String]
		statusCode: String
		statusCodeNumber: Int
		created_by: User
		created_at: String
		updated_at: String
	}
`;