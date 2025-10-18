/**
 * Mongoose Plugin for Soft Delete and Status Management
 *
 * This plugin adds status management and soft delete functionality to Mongoose schemas.
 * Instead of physically removing documents from the database, it marks them as "DELETED"
 * and automatically filters them out from queries.
 *
 * FEATURES:
 * - Adds 'status' field with enum values (ACTIVE, INACTIVE, DELETED, etc.)
 * - Provides softDelete() method on document instances
 * - Automatic filtering of deleted documents in find queries
 * - Query helper to explicitly include/exclude deleted documents
 *
 * USAGE:
 *
 * 1. Apply the plugin to your schema:
 *    ```typescript
 *    import { statusPlugin } from './plugins/status.plugin';
 *    import { Schema } from 'mongoose';
 *
 *    const userSchema = new Schema({
 *      name: String,
 *      email: String
 *    });
 *
 *    userSchema.plugin(statusPlugin);
 *    ```
 *
 * 2. Use in your code:
 *    ```typescript
 *    // Soft delete a user (marks as DELETED instead of removing)
 *    const user = await User.findById(userId);
 *    await user.softDelete();
 *
 *    // Find all active users (automatically excludes DELETED)
 *    const activeUsers = await User.find({});
 *
 *    // Find including deleted users
 *    const allUsers = await User.find({ status: { $in: ['ACTIVE', 'DELETED'] } });
 *
 *    // Use query helper to explicitly exclude deleted
 *    const nonDeletedUsers = await User.find().notDeleted();
 *    ```
 *
 * 3. Available statuses (from GenericStatusConstant):
 *    - ACTIVE: Normal active document
 *    - INACTIVE: Document is inactive but not deleted
 *    - DELETED: Soft-deleted document (excluded from queries by default)
 *    - PENDING: Awaiting activation/approval
 *
 * NOTE: The pre-find middleware automatically filters out DELETED documents
 * unless you explicitly query by status. Use `.find({ status: 'DELETED' })`
 * to retrieve deleted documents when needed.
 */
import { Schema, Query } from 'mongoose';
import { GenericStatusConstant } from '../types/GenericStatusConstant';

export const statusPlugin = (schema: Schema) => {
    // ... plugin implementation remains the same
    schema.add({
        status: {
            type: String,
            enum: Object.values(GenericStatusConstant),
            required: true,
            default: GenericStatusConstant.ACTIVE,
        },
    });

    // Method to softly delete a document
    schema.methods.softDelete = function () {
        this.status = GenericStatusConstant.DELETED;
        return this.save();
    };

    // Query helper to find active documents
    (schema.query as any).notDeleted = function (this: Query<any, any>) {
        return this.where({ status: { $ne: GenericStatusConstant.DELETED } });
    };

    // Middleware to exclude deleted documents from find queries
    schema.pre(/^find/, function (this: Query<any, any>, next) {
        const filter = this.getFilter();
        if (filter.status === undefined) {
            this.where({ status: { $ne: GenericStatusConstant.DELETED } });
        }
        next();
    });
};